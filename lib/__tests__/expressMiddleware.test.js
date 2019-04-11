const debug = require("debug")

const {
  wrapResponse,
  validateResponse,
  validateResponseByAJV,
  checkValidationResult
} = require("../expressMiddleware")

jest.mock("debug")
describe("Test validateResponseByAJV", () => {
  it("Should do nothing when given data is not JSON", async () => {
    const validatedResult = validateResponseByAJV({
      content: Buffer.from("FooBar"),
      encoding: "utf8"
    })
    expect(validatedResult).toBeUndefined()
  })
})

describe("Test wrapResponse", () => {
  it("Should wrap res object and capture response from both write and end", async () => {
    const res = {
      statusCode: 200,
      write: jest.fn(),
      end: jest.fn()
    }
    const routeSpec = {
      ajv: {},
      spec: {
        getResponse: jest.fn()
      },
      responseValidateOptions: {}
    }
    const next = jest.fn()
    wrapResponse(routeSpec, res, next)
    res.write(Buffer.from("www"))
    res.write(Buffer.from("www"))
    res.end(Buffer.from("end"), "utf8")
    expect(res.write).not.toBeCalled()
    expect(routeSpec.spec.getResponse).toHaveBeenCalledWith(res.statusCode)
    expect(res.end).toHaveBeenCalledWith(Buffer.from("wwwwwwend"), "utf8")
  })

  it("Should handle string case for both write and end", async () => {
    const res = {
      statusCode: 200,
      write: jest.fn(),
      end: jest.fn()
    }
    const routeSpec = {
      ajv: {},
      spec: {
        getResponse: jest.fn()
      },
      responseValidateOptions: {}
    }
    const next = jest.fn()
    wrapResponse(routeSpec, res, next)
    res.write("www")
    res.write("www")
    res.end("end", "utf8")
    expect(res.write).not.toBeCalled()
    expect(routeSpec.spec.getResponse).toHaveBeenCalledWith(res.statusCode)
    expect(res.end).toHaveBeenCalledWith(Buffer.from("wwwwwwend"), "utf8")
  })
})

describe("Test validateResponse", () => {
  it("Should validate by sway if response data is not json", () => {
    const responseSchema = {
      validateResponse: jest.fn().mockReturnValue({ errors: [], warnings: [] })
    }
    validateResponse(
      {
        content: Buffer.from("Foo"),
        encoding: "utf8"
      },
      {
        getHeaders: () => ({
          Content: "json"
        }),
        statusCode: 200
      },
      {
        spec: {
          getResponse: jest.fn().mockReturnValue(responseSchema)
        },
        responseValidateOptions: {
          foo: "foo"
        }
      }
    )
    expect(responseSchema.validateResponse).toHaveBeenCalledWith(
      {
        body: Buffer.from("Foo"),
        headers: { Content: "json" },
        statusCode: 200,
        encoding: "utf8"
      },
      {
        foo: "foo"
      }
    )
  })
})

describe("Test checkValidationResult", () => {
  beforeEach(() => {
    debug.mockReset()
  })
  it("Should print debug log when validation warning", () => {
    checkValidationResult({
      errors: [],
      warnings: [{}]
    })
    expect(debug).toHaveBeenCalledTimes(1)
  })
})
