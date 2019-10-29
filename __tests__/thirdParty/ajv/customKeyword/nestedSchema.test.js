const swaggerCombine = require("swagger-combine")

const schema = require("./nestedSchema")
const ajvCreator = require("./ajvCreator")

describe("Test AJV custom keyword - nested schema", () => {
  it("Should working with objB", async () => {
    const _schema = await swaggerCombine(schema)
    const ajv = ajvCreator(_schema, {
      $data: true
    })
    const validate = ajv.compile(_schema)
    validate({
      objType: "B",
      bProp: "fuckOff",
      subObjType: "BA",
      baProp: "foobar"
    })
    expect(validate.errors).toBeNull()
  })

  it("Should working with objA", async () => {
    const _schema = await swaggerCombine(schema)
    const ajv = ajvCreator(_schema, {
      $data: true
    })
    const validate = ajv.compile(_schema)
    validate({
      objType: "A",
      aProp: "fuckOff",
      subObjType: "AA",
      aaProp: "foobar"
    })
    expect(validate.errors).toBeNull()
  })

  it("Should error with objA due to missing aProp", async () => {
    const _schema = await swaggerCombine(schema)
    const ajv = ajvCreator(_schema, {
      $data: true
    })
    const validate = ajv.compile(_schema)
    validate({
      objType: "A"
    })
    expect(validate.errors).not.toBeNull()
    expect(validate.errors).toHaveLength(2)
  })
})
