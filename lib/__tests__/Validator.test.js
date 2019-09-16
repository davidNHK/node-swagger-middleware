const utils = require("../utils")
const Validator = require("../Validator")

describe("Test validate response", () => {
  it("Should working with minimum parameter", () => {
    const isAlignToJSONSchema = jest
      .spyOn(utils, "isAlignToJSONSchema")
      .mockReturnValue({})
    const req = {}
    const res = {
      getHeaders: jest.fn(),
      statusCode: 200
    }
    const ajvInstance = {}
    const pathSpec = {
      validateResponse: jest.fn().mockReturnValue({
        errors: [],
        warnings: []
      })
    }
    const routeSpec = {
      getResponse: jest.fn().mockReturnValue(pathSpec)
    }
    const body = "foobar!"
    const bodyBuf = Buffer.from(body)
    const validator = new Validator(req, res, routeSpec, {
      ajvRequest: ajvInstance,
      ajvResponse: ajvInstance
    })
    validator.validateResponse(bodyBuf, "utf8")
    expect(isAlignToJSONSchema).not.toHaveBeenCalled()
    expect(pathSpec.validateResponse).toHaveBeenCalledWith(
      {
        body: bodyBuf,
        headers: {},
        statusCode: res.statusCode,
        encoding: "utf8"
      },
      {}
    )
    isAlignToJSONSchema.mockReset()
  })
  it("Should validate the response content - json body", () => {
    const isAlignToJSONSchema = jest
      .spyOn(utils, "isAlignToJSONSchema")
      .mockReturnValue({})
    const req = {}
    const res = {}
    const ajvInstance = {}
    const routeSpec = {
      getResponse: jest.fn().mockReturnValue({
        definition: {
          schema: {}
        }
      }),
      validateResponse: jest.fn().mockReturnValue({
        errors: [],
        warnings: []
      })
    }
    const body = {
      foo: "bar"
    }
    const bodyBuf = Buffer.from(JSON.stringify(body))
    const options = {}
    const validator = new Validator(req, res, routeSpec, {
      ajvRequest: ajvInstance,
      ajvResponse: ajvInstance
    })
    validator.validateResponse(bodyBuf, "utf8", options)
    expect(isAlignToJSONSchema).toHaveBeenCalledWith(
      body,
      expect.any(Object),
      ajvInstance
    )
    isAlignToJSONSchema.mockReset()
  })

  it("Should validate the response content - normal string", () => {
    const isAlignToJSONSchema = jest
      .spyOn(utils, "isAlignToJSONSchema")
      .mockReturnValue({})
    const req = {}
    const res = {
      getHeaders: jest.fn(),
      statusCode: 200
    }
    const ajvInstance = {}
    const pathSpec = {
      validateResponse: jest.fn().mockReturnValue({
        errors: [],
        warnings: []
      })
    }
    const routeSpec = {
      getResponse: jest.fn().mockReturnValue(pathSpec)
    }
    const body = "foobar!"
    const bodyBuf = Buffer.from(body)
    const options = {}
    const validator = new Validator(req, res, routeSpec, {
      ajvRequest: ajvInstance,
      ajvResponse: ajvInstance
    })
    validator.validateResponse(bodyBuf, "utf8", options)
    expect(isAlignToJSONSchema).not.toHaveBeenCalled()
    expect(pathSpec.validateResponse).toHaveBeenCalledWith(
      {
        body: bodyBuf,
        headers: {},
        statusCode: res.statusCode,
        encoding: "utf8"
      },
      options
    )
    isAlignToJSONSchema.mockReset()
  })

  it("Should validate the response content - response schema not defined", () => {
    const req = {}
    const res = {
      getHeaders: jest.fn(),
      statusCode: 200
    }
    const ajvInstance = {}
    const routeSpec = {
      getResponse: jest.fn()
    }
    const body = "foobar!"
    const bodyBuf = Buffer.from(body)
    const options = {}
    const validator = new Validator(req, res, routeSpec, {
      ajvRequest: ajvInstance,
      ajvResponse: ajvInstance
    })
    validator.validateResponse(bodyBuf, "utf8", options)
    expect(routeSpec.getResponse).toHaveBeenCalledWith(200)
  })
})

describe("Test validate request", () => {
  it("Should working with minimum parameter", () => {
    const req = {}
    const res = {}
    const routeSpec = {
      validateRequest: jest.fn().mockReturnValue({
        errors: [],
        warnings: []
      })
    }
    const ajvInstance = {}
    const validator = new Validator(req, res, routeSpec, {
      ajvRequest: ajvInstance,
      ajvResponse: ajvInstance
    })
    validator.validateRequest()
    expect(routeSpec.validateRequest).toHaveBeenCalledWith(req, {
      customValidators: [expect.any(Function)]
    })
  })
  it("Should validate the request", () => {
    const req = {}
    const res = {}
    const routeSpec = {
      validateRequest: jest.fn().mockReturnValue({
        errors: [],
        warnings: []
      })
    }
    const ajvInstance = {}
    const options = {}
    const validator = new Validator(req, res, routeSpec, {
      ajvRequest: ajvInstance,
      ajvResponse: ajvInstance
    })
    validator.validateRequest(options)
    expect(routeSpec.validateRequest).toHaveBeenCalledWith(req, {
      ...options,
      customValidators: [expect.any(Function)]
    })
  })

  it("Should validate the request body", () => {
    const isAlignToJSONSchema = jest
      .spyOn(utils, "isAlignToJSONSchema")
      .mockReturnValue({})
    const req = {
      body: {}
    }
    const res = {}
    const routeSpec = {
      validateRequest: jest.fn().mockReturnValue({
        errors: [],
        warnings: []
      })
    }
    const ajvInstance = {}
    const schema = {
      requestBody: {
        schema: { foo: "bar" }
      }
    }
    const validator = new Validator(req, res, routeSpec, {
      ajvRequest: ajvInstance,
      ajvResponse: ajvInstance
    })
    validator.validateRequestBody(req, schema)
    expect(isAlignToJSONSchema).toHaveBeenCalledWith(
      req.body,
      expect.objectContaining(schema.requestBody.schema),
      ajvInstance
    )
    isAlignToJSONSchema.mockReset()
  })

  it("Should bypass validate request body", () => {
    const isAlignToJSONSchema = jest.spyOn(utils, "isAlignToJSONSchema")
    const req = {
      body: {}
    }
    const res = {}
    const routeSpec = {
      validateRequest: jest.fn().mockReturnValue({
        errors: [],
        warnings: []
      })
    }
    const ajvInstance = {}
    const schema = {
      requestBody: {}
    }
    const validator = new Validator(req, res, routeSpec, {
      ajvRequest: ajvInstance,
      ajvResponse: ajvInstance
    })
    validator.validateRequestBody(req, schema)
    expect(isAlignToJSONSchema).not.toHaveBeenCalled()
    isAlignToJSONSchema.mockReset()
  })
})
