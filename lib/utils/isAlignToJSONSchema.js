const { AJVValidationError } = require("../errors")

function isAlignToJSONSchema(data, jsonSchema, ajvInstance) {
  if (!data) return
  const validate = ajvInstance.compile(jsonSchema)
  const isJsonDataMatchSchema = validate(data)
  if (!isJsonDataMatchSchema) {
    throw new AJVValidationError(validate.errors)
  }
  return data
}

module.exports = isAlignToJSONSchema
