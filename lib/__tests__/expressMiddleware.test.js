const { promisify } = require("util")

const sway = require("sway")

const Validator = require("../Validator")
const { createExpressMiddleware } = require("../expressMiddleware")

jest.mock("../Validator")
jest.mock("sway")

describe("Test express middleware", () => {
  let validator
  beforeEach(() => {
    validator = {
      validateRequest: jest.fn(),
      validateResponse: jest.fn()
    }
    Validator.mockImplementation(() => validator)
    sway.create.mockResolvedValue({
      getOperation: jest.fn().mockReturnValue({})
    })
  })
  it("Should working with response - response is normal string", async () => {
    const responseBody = Buffer.from("FooBar!FooBar!")
    validator.validateResponse.mockReturnValue(responseBody)
    const req = {}
    const res = {
      write: jest.fn(),
      end: jest.fn(),
      json: jest.fn()
    }
    const middleware = await createExpressMiddleware({})
    await promisify(middleware)(req, res)
    res.write("FooBar!")
    res.end("FooBar!", "utf8")
    expect(Validator).toHaveBeenCalled()
    expect(validator.validateRequest).toHaveBeenCalled()
    expect(validator.validateResponse).toHaveBeenCalledWith(
      responseBody,
      "utf8",
      undefined
    )
    expect(res.end).toHaveBeenCalledWith(responseBody, "utf8")
  })

  it("Should working with response - response is json", async () => {
    const responseBody = Buffer.from(JSON.stringify({ foo: "bar" }))
    validator.validateResponse.mockReturnValue(responseBody)
    const req = {}
    const res = {
      write: jest.fn(),
      end: jest.fn(),
      json: jest.fn()
    }
    const middleware = await createExpressMiddleware({})
    await promisify(middleware)(req, res)
    res.end(responseBody, "utf8")
    expect(Validator).toHaveBeenCalled()
    expect(validator.validateRequest).toHaveBeenCalled()
    expect(validator.validateResponse).toHaveBeenCalledWith(
      responseBody,
      "utf8",
      undefined
    )
    expect(res.json).toHaveBeenCalledWith({ foo: "bar" })
    expect(res.end).not.toHaveBeenCalled()
  })
})
