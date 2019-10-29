const _ = require("lodash")
const Ajv = require("ajv")

const { DiscriminatorReferenceNotFoundError } = require("../errors")

class AJVPatch {
  constructor(ajv, fullSchema) {
    this.fullSchema = fullSchema
    this.orgOneOfImplementation = ajv.RULES.all.oneOf.code
    this.checkOneOf = this.checkOneOf.bind(this)
    this.transpilerDiscriminator = this.transpilerDiscriminator.bind(this)
  }

  checkOneOf(it, keyword, schema) {
    if (it.schema.discriminator) {
      return undefined // disable the checking if discriminator available
    }
    return this.orgOneOfImplementation(it, keyword, schema)
  }

  transpilerDiscriminator() {
    return {
      macro: (schema, parentSchema) => {
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
                  this.fullSchema,
                  value.split("/").slice(1)
                )
                if (resolvedSchema) {
                  return Object.assign(acc, { [key]: resolvedSchema })
                }
                throw new DiscriminatorReferenceNotFoundError(schema)
              }
              return Object.assign(acc, { [key]: { $ref: value } })
            },
            {}
          )
        }
        return newSchema
      }
    }
  }
}

const createAJVInstance = (fullSchema, opts) => {
  const ajv = new Ajv({ ...opts, $data: true })
  require("ajv-keywords")(ajv)
  const ajvPatcher = new AJVPatch(ajv, fullSchema)
  ajv.RULES.all.oneOf.code = ajvPatcher.checkOneOf
  ajv.addKeyword("discriminator", ajvPatcher.transpilerDiscriminator())
  return ajv
}

module.exports = createAJVInstance
module.exports.AJVPatch = AJVPatch
