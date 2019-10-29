const { AJVPatch } = require("../createAJVInstance")
const { DiscriminatorReferenceNotFoundError } = require("../../errors")

describe("Test ajv patch", () => {
  it("Should operate oneOf normally if discriminator not available", () => {
    const oneOfFunc = jest.fn()
    const context = {
      schema: {}
    }
    const patcher = new AJVPatch({
      RULES: { all: { oneOf: { code: oneOfFunc } } }
    })
    patcher.checkOneOf(context, "foo", {})
    expect(oneOfFunc).toHaveBeenCalledWith(context, "foo", {})
  })

  it("Should pass oneOf checking if discriminator available", () => {
    const oneOfFunc = jest.fn()
    const context = {
      schema: {
        discriminator: {}
      }
    }
    const patcher = new AJVPatch({
      RULES: { all: { oneOf: { code: oneOfFunc } } }
    })
    patcher.checkOneOf(context, "foo", {})
    expect(oneOfFunc).not.toHaveBeenCalled()
  })

  it("Should transpiler discriminator to select", () => {
    const oneOfFunc = jest.fn()
    const patcher = new AJVPatch(
      {
        RULES: { all: { oneOf: { code: oneOfFunc } } }
      },
      {
        def: {
          bar: {}
        }
      }
    )
    const transpiledResult = patcher.transpilerDiscriminator().macro(
      {
        propertyName: "foo",
        mapping: { bar: "#/def/bar" }
      },
      {}
    )
    expect(transpiledResult).toEqual({
      required: ["foo"],
      select: {
        $data: "0/foo"
      },
      selectDefault: {
        type: "object",
        properties: {
          foo: {
            enum: ["bar"]
          }
        }
      },
      selectCases: {
        bar: {}
      }
    })
  })

  it("Should add field required", () => {
    const oneOfFunc = jest.fn()
    const patcher = new AJVPatch(
      {
        RULES: { all: { oneOf: { code: oneOfFunc } } }
      },
      {
        def: {
          bar: {}
        }
      }
    )
    const transpiledResult = patcher.transpilerDiscriminator().macro(
      {
        propertyName: "foo",
        mapping: { bar: "#/def/bar" }
      },
      {
        required: ["bar"]
      }
    )
    expect(transpiledResult).toEqual({
      required: ["foo", "bar"],
      select: {
        $data: "0/foo"
      },
      selectDefault: {
        type: "object",
        properties: {
          foo: {
            enum: ["bar"]
          }
        }
      },
      selectCases: {
        bar: {}
      }
    })
  })

  it("Should do nothing when ref is abs ref", () => {
    const oneOfFunc = jest.fn()
    const patcher = new AJVPatch(
      {
        RULES: { all: { oneOf: { code: oneOfFunc } } }
      },
      {
        def: {
          bar: {}
        }
      }
    )
    const transpiledResult = patcher.transpilerDiscriminator().macro(
      {
        propertyName: "foo",
        mapping: { bar: "www.json#/def/bar" }
      },
      {
        required: ["bar"]
      }
    )
    expect(transpiledResult).toEqual({
      required: ["foo", "bar"],
      select: {
        $data: "0/foo"
      },
      selectDefault: {
        type: "object",
        properties: {
          foo: {
            enum: ["bar"]
          }
        }
      },
      selectCases: {
        bar: { $ref: "www.json#/def/bar" }
      }
    })
  })

  it("Should error when ref not found", () => {
    const oneOfFunc = jest.fn()
    const patcher = new AJVPatch(
      {
        RULES: { all: { oneOf: { code: oneOfFunc } } }
      },
      {}
    )
    expect(() =>
      patcher.transpilerDiscriminator().macro(
        {
          propertyName: "foo",
          mapping: { bar: "#/def/bar" }
        },
        {
          required: ["bar"]
        }
      )
    ).toThrow(DiscriminatorReferenceNotFoundError)
  })
})
