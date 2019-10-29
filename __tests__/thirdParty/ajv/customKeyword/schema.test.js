const schema = require("./schema")
const ajvCreator = require("./ajvCreator")

const ajv = ajvCreator(schema, {
  $data: true
})
const validate = ajv.compile(schema)

describe("Test AJV custom keyword", () => {
  it("Should working with objB", async () => {
    validate({
      objType: "B",
      bProp: "fuckOff"
    })
    expect(validate.errors).toBeNull()
  })

  it("Should working with objA", () => {
    validate({
      objType: "A",
      aProp: "fuckOff"
    })
    expect(validate.errors).toBeNull()
  })

  it("Should error with objA due to missing aProp", () => {
    validate({
      objType: "C"
    })
    expect(validate.errors).not.toBeNull()
    expect(validate.errors).toHaveLength(2)
  })
})
