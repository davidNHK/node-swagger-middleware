const _ = require("lodash")
const Ajv = require("ajv")

const createAJVInstance = (fullSchema, opts) => {
  const ajv = new Ajv(opts)
  require("ajv-keywords")(ajv)
  const orgOneOfImplementation = ajv.RULES.all.oneOf.code
  ajv.RULES.all.oneOf.code = (it, keyword, schema) => {
    if (it.schema.discriminator) {
      return undefined // disable the checking if discriminator available
    }
    return orgOneOfImplementation(it, keyword, schema)
  }
  ajv.addKeyword("discriminator", {
    macro: function(schema, parentSchema) {
      const newSchema = {
        required: _.uniq([
          schema.propertyName,
          ...(parentSchema.required || [])
        ]),
        select: {
          $data: `0/${schema.propertyName}`
        },
        selectDefault: {
          type: "object",
          properties: {
            [schema.propertyName]: { enum: Object.keys(schema.mapping) }
          }
        },
        selectCases: _.reduce(
          schema.mapping,
          (acc, value, key) => {
            // https://github.com/epoberezkin/ajv-keywords/tree/c11dc4a7297bf4bd424ac30e111e8f7688ff9f89#selectselectcasesselectdefault
            if (value.startsWith("#")) {
              const resolvedSchema = _.get(
                fullSchema,
                value.split("/").slice(1)
              )
              return Object.assign(acc, { [key]: resolvedSchema })
            }
            return Object.assign(acc, { [key]: { $ref: value } })
          },
          {}
        )
      }
      return newSchema
    }
  })
  return ajv
}

module.exports = createAJVInstance
