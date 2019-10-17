const utils = require("./utils")

class Validator {
  constructor(
    req,
    res,
    routeSpec,
    { ajvRequest, ajvResponse, extraSchemaAttribute, resolvers }
  ) {
    this.req = req
    this.res = res
    this.routeSpec = routeSpec
    this.ajvRequest = ajvRequest
    this.ajvResponse = ajvResponse
    this.swaggerSchema = extraSchemaAttribute || {}
    this.resolvers = resolvers || {}
  }

  validateRequestBody(req, def) {
    const requestBodySchema = utils.deepFindByKey("schema")(def.requestBody)
    if (!requestBodySchema) return
    const { schema: targetSchema, key } = utils.resolveSchema(
      req,
      requestBodySchema,
      this.resolvers
    )
    const schema = utils.toJSONSchema(`request:${def.ptr}:${key}`, {
      ...this.swaggerSchema,
      ...targetSchema
    })
    utils.isAlignToJSONSchema(req.body, schema, this.ajvRequest)
  }

  validateRequest(validateRequestOptions = {}) {
    const { req, routeSpec } = this
    utils.checkValidationResult(
      routeSpec.validateRequest(req, {
        ...validateRequestOptions,
        customValidators: [
          ...(validateRequestOptions.customValidators || []),
          this.validateRequestBody.bind(this)
        ]
      })
    )
  }

  validateResponse(dataBuf, encoding, validateResponseOptions = {}) {
    const { ajvResponse, routeSpec, res, req } = this
    const pathSpec = routeSpec.getResponse(res.statusCode)
    if (!pathSpec) {
      return dataBuf
    }
    const responseBodySchema = utils.deepFindByKey("schema")(
      pathSpec.definition
    )
    const jsonResponse = utils.safeParseJSONFromBuffer(dataBuf, encoding)
    if (!jsonResponse || !responseBodySchema) {
      utils.checkValidationResult(
        pathSpec.validateResponse(
          {
            body: dataBuf,
            headers: { ...res.getHeaders() },
            statusCode: res.statusCode,
            encoding: encoding
          },
          validateResponseOptions
        )
      )
      return dataBuf
    }
    const { schema: targetSchema, key } = utils.resolveSchema(
      req,
      responseBodySchema,
      this.resolvers
    )
    const schema = utils.toJSONSchema(`response:${pathSpec.ptr}:${key}`, {
      ...this.swaggerSchema,
      ...targetSchema
    })
    const jsonResponseAfterFix = utils.isAlignToJSONSchema(
      jsonResponse,
      schema,
      ajvResponse
    )
    return Buffer.from(JSON.stringify(jsonResponseAfterFix))
  }
}

module.exports = Validator
