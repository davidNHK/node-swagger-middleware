const oneOfSchema = require("./oneOfSchema")
const ajvCreator = require("./ajvCreator")

const ajv = ajvCreator(oneOfSchema, {
  $data: true
})
const validate = ajv.compile(oneOfSchema)

describe("Test AJV custom keyword - oneOfSchema", () => {
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

  it("Should error with objC due to missing cProp", () => {
    validate({
      objType: "C"
    })
    expect(validate.errors).not.toBeNull()
    expect(validate.errors).toHaveLength(4)
  })
})
