const debug = require("debug")

const { ValidationError } = require("../../errors")
const checkValidationResult = require("../checkValidationResult")

jest.mock("debug")

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

  it("Should throw error when validation errors", () => {
    expect(() =>
      checkValidationResult({
        errors: [{}],
        warnings: []
      })
    ).toThrow(ValidationError)
  })
})
