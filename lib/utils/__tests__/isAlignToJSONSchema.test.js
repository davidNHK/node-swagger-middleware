const { AJVValidationError } = require("../../errors")
const isAlignToJSONSchema = require("../isAlignToJSONSchema")

it("Should skip when given data is undefined", () => {
  expect(isAlignToJSONSchema(undefined)).toBeUndefined()
})

it("Should throw exception when validation error", () => {
  const validator = Object.assign(jest.fn(), {
    errors: []
  })
  const ajv = {
    compile: jest.fn().mockReturnValue(validator)
  }
  expect(() => isAlignToJSONSchema({ foo: "bar" }, {}, ajv)).toThrow(
    AJVValidationError
  )
})

it("Should working", () => {
  const validator = jest.fn().mockReturnValue({
    foo: "bar"
  })
  const ajv = {
    compile: jest.fn().mockReturnValue(validator)
  }
  isAlignToJSONSchema({ foo: "bar" }, {}, ajv)
  expect(ajv.compile).toHaveBeenCalledWith({})
  expect(validator).toHaveBeenCalledWith({
    foo: "bar"
  })
})
