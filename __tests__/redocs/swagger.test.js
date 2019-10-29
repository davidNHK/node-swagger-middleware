const { deepOmit } = require("./swagger")

it("Should omit the field", () => {
  expect(
    deepOmit(
      {
        foo: {},
        bar: {
          foo: {},
          bar: {
            foo: {}
          }
        },
        barArr: [{ foo: {} }, { bar: {} }]
      },
      ["foo"]
    )
  ).toEqual({
    bar: { bar: {} },
    barArr: [{}, { bar: {} }]
  })
})
