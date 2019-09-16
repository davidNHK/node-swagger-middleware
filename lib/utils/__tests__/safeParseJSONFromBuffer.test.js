const safeParseJSONFromBuffer = require("../safeParseJSONFromBuffer")

it("Should parse buffer to JSON", () => {
  const content = Buffer.from(
    JSON.stringify({
      foo: "bar"
    })
  )
  expect(safeParseJSONFromBuffer(content, "utf8")).toEqual({
    foo: "bar"
  })
})

it("Should silent bypass error", () => {
  const content = Buffer.from("!@#$%")
  expect(safeParseJSONFromBuffer(content, "utf8")).toEqual(undefined)
})
