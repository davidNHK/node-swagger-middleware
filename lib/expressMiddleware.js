const debug = require("debug")
const sway = require("sway")
const Ajv = require("ajv")

const utils = require("./utils")
const {
  ValidationError,
  SpecNotFoundError,
  AJVValidationError
} = require("./errors")

function checkValidationResult(validationResult) {
  if (validationResult.errors.length > 0) {
    debug("SwaggerValidationError:", validationResult)
    throw new ValidationError(validationResult)
  }

  if (validationResult.warnings.length > 0) {
    debug(`Swagger validation warning: ${validationResult.warnings}`)
  }
}

function toJSONSchema(id, swaggerSchema) {
  const jsonSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: id,
    ...swaggerSchema
  }
  return jsonSchema
}

function responseBodyToJson(encoding, data) {
  try {
    return JSON.parse(data.toString(encoding))
  } catch (e) {
    return undefined
  }
}

function validateResponseByAJV(data, schema, ajvCompiler) {
  const jsonData = responseBodyToJson(data.encoding, data.content)
  if (jsonData) {
    const jsonSchema = toJSONSchema(
      `response:${schema.ptr}`,
      utils.deepFindByKey("schema")(schema.definition)
    )
    const validate = ajvCompiler.compile(jsonSchema)
    const isJsonDataMatchSchema = validate(jsonData)
    if (!isJsonDataMatchSchema) {
      throw new AJVValidationError(validate.errors)
    }
    return Buffer.from(JSON.stringify(jsonData))
  }
  return undefined
}

function validateResponse(data, res, routeSpec) {
  const { ajv, spec, responseValidateOptions } = routeSpec
  const pathSpec = spec.getResponse(res.statusCode)
  if (!pathSpec) {
    return data.content
  }
  const validatedData = validateResponseByAJV(data, pathSpec, ajv)
  if (!validatedData) {
    checkValidationResult(
      pathSpec.validateResponse(
        {
          body: data.content,
          headers: { ...res.getHeaders() },
          statusCode: res.statusCode,
          encoding: data.encoding
        },
        responseValidateOptions
      )
    )
    return data.content
  }
  return validatedData
}

function validateRequestByAJV(data, schema, ajvCompiler) {
  if (data) {
    const jsonSchema = toJSONSchema(
      `request:${schema.ptr}`,
      utils.deepFindByKey("schema")(schema.requestBody)
    )

    const validate = ajvCompiler.compile(jsonSchema)
    const isJsonDataMatchSchema = validate(data)
    if (!isJsonDataMatchSchema) {
      throw new AJVValidationError(validate.errors)
    }
  }
}

function wrapResponse(routeSpec, res, next) {
  const { write: oldWrite, end: oldEnd } = res

  const chunks = []

  res.write = function(chunk) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk)
  }

  res.end = function(chunk, encoding) {
    if (chunk) {
      chunks.push(
        typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk
      )
    }
    res.write = oldWrite
    res.end = oldEnd
    const data = Buffer.concat(chunks)
    try {
      const validatedData = validateResponse(
        {
          content: data,
          encoding
        },
        res,
        routeSpec
      )
      const dataInJSON = responseBodyToJson(encoding, validatedData)
      if (dataInJSON) {
        res.json(dataInJSON)
      } else {
        res.end(validatedData, encoding)
      }
    } catch (e) {
      next(e)
    }
  }
}

async function createExpressMiddleware(
  swaggerObject,
  options = {
    swayOptions: {}, // https://github.com/apigee-127/sway/blob/master/docs/API.md#swaycreateoptions--object
    swayValidateRequestOptions: {
      strictMode: true
    },
    swayValidateResponseOptions: {
      strictMode: false
    },
    ajvRequestOptions: {
      useDefaults: true
    },
    ajvResponseOptions: {
      removeAdditional: true,
      coerceTypes: true
    },
    middlewareOptions: {
      strictMode: false
    }
  }
) {
  const {
    swayOptions,
    middlewareOptions,
    swayValidateRequestOptions,
    swayValidateResponseOptions,
    ajvRequestOptions,
    ajvResponseOptions
  } = options
  const { strictMode } = middlewareOptions
  const ajvRequest = new Ajv(ajvRequestOptions)
  const ajvResponse = new Ajv(ajvResponseOptions)
  const apiSpec = await sway.create({
    definition: swaggerObject,
    ...swayOptions
  })
  return async (req, res, next) => {
    const { method, path } = req

    const routeSpec = apiSpec.getOperation(req)
    if (!routeSpec) {
      if (strictMode) {
        return next(new SpecNotFoundError(method, path))
      }
      debug(`No matched spec found for ${method} ${path}`)
      return next()
    }

    wrapResponse(
      {
        spec: routeSpec,
        responseValidateOptions: swayValidateResponseOptions,
        ajv: ajvResponse
      },
      res,
      next
    )
    try {
      checkValidationResult(
        routeSpec.validateRequest(req, {
          ...swayValidateRequestOptions,
          customValidators: [
            ...(swayValidateRequestOptions.customValidators || []),
            (req, def) => {
              validateRequestByAJV(req.body, def, ajvRequest)
            }
          ]
        })
      )
      next()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = {
  createExpressMiddleware,
  checkValidationResult,
  validateRequestByAJV,
  validateResponseByAJV,
  validateResponse,
  wrapResponse
}
