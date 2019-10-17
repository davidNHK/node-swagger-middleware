const _ = require("lodash")

const { DiscriminatorMappingNotFoundError } = require("../errors")

function resolveSchema(req, schema, resolvers) {
  const discriminator = schema.discriminator
  if (discriminator) {
    const propertyValue = req.body[_.get(discriminator, "propertyName")]
    const mappings = discriminator.mapping
    let mappingKey = propertyValue
    if (resolvers) {
      if (resolvers[propertyValue]) {
        const resolverFunction = resolvers[propertyValue]
        mappingKey = resolverFunction(req, discriminator)
      }
    }
    const targetSchema = mappings[mappingKey]
    if (!targetSchema) {
      throw new DiscriminatorMappingNotFoundError(
        discriminator,
        propertyValue,
        resolvers
      )
    }
    return {
      schema: {
        $ref: targetSchema
      },
      key: mappingKey
    }
  }
  return { schema }
}

module.exports = resolveSchema
