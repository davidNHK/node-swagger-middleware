const resolveSchema = require("../resolveSchema")
const { DiscriminatorMappingNotFoundError } = require("../../errors")

describe("Test resolve schema", () => {
  it("Should working with non discriminated schema", () => {
    const schema = {
      type: "object"
    }
    const resolvedSchema = resolveSchema({}, schema, {})
    expect(resolvedSchema).toEqual({ schema })
  })

  it("Should working with discriminated schema", () => {
    const req = {
      body: {
        foo: "bar"
      }
    }
    const schema = {
      discriminator: {
        propertyName: "foo",
        mapping: {
          foobar: "finalResult"
        }
      }
    }
    const resolvers = {
      bar: () => "foobar"
    }
    const resolvedSchema = resolveSchema(req, schema, resolvers)
    expect(resolvedSchema).toEqual({
      schema: {
        $ref: "finalResult"
      },
      key: "foobar"
    })
  })

  it("Should use mapping when resolvers not provided", () => {
    const req = {
      body: {
        foo: "bar"
      }
    }
    const schema = {
      discriminator: {
        propertyName: "foo",
        mapping: {
          bar: "finalResult"
        }
      }
    }
    expect(resolveSchema(req, schema)).toEqual({
      schema: {
        $ref: "finalResult"
      },
      key: "bar"
    })
  })

  it("Should throw error when mapping not found", () => {
    const req = {
      body: {
        foo: "foobar"
      }
    }
    const schema = {
      discriminator: {
        propertyName: "foo",
        mapping: {
          bar: "finalResult"
        }
      }
    }
    expect(() => resolveSchema(req, schema)).toThrow(
      DiscriminatorMappingNotFoundError
    )
  })
})
