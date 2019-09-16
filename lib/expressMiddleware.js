const debug = require("debug")
const sway = require("sway")
const Ajv = require("ajv")

const hookResponseContent = require("./express/hookResponseContent")
const utils = require("./utils")
const Validator = require("./Validator")
const { SpecNotFoundError } = require("./errors")

async function createExpressMiddleware(swaggerObject, options = {}) {
  const {
    swayOptions = {}, // https://github.com/apigee-127/sway/blob/master/docs/API.md#swaycreateoptions--object
    swayValidateRequestOptions = {
      strictMode: false
    },
    swayValidateResponseOptions,
    ajvRequestOptions = {
      useDefaults: true
    },
    ajvResponseOptions = {
      removeAdditional: true,
      coerceTypes: true
    },
    middlewareOptions = {
      strictMode: false
    }
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
    const validator = new Validator(req, res, routeSpec, {
      ajvRequest,
      ajvResponse
    })
    hookResponseContent(res, (err, data, encoding) => {
      if (err) return next(err)
      try {
        const responseAfterValidate = validator.validateResponse(
          data,
          encoding,
          swayValidateResponseOptions
        )
        const dataJSON = utils.safeParseJSONFromBuffer(
          responseAfterValidate,
          encoding
        )
        if (dataJSON) {
          res.json(dataJSON)
        } else {
          res.end(responseAfterValidate, encoding)
        }
      } catch (e) {
        next(e)
      }
    })
    try {
      validator.validateRequest(swayValidateRequestOptions)
      next()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = {
  createExpressMiddleware
}
