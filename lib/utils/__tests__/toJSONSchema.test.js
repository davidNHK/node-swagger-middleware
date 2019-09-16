const toJSONSchema = require("../toJSONSchema")

it("Should add additional field to json schema", () => {
  const schema = {
    type: "object",
    properties: {
      name: {
        type: "string"
      }
    }
  }
  const jsonSchema = toJSONSchema("schema-id-unit-test", schema)
  expect(jsonSchema).toHaveProperty("$id")
  expect(jsonSchema.$schema).toEqual("http://json-schema.org/draft-07/schema#")
})
