const _ = require("lodash")

const { DiscriminatorMappingNotFoundError } = require("../errors")

function resolveSchema(req, schema, resolvers) {
  const discriminator = schema.discriminator
  if (discriminator) {
    const propertyValue = req.body[_.get(discriminator, "propertyName")]
    const mappings = discriminator.mapping
    let mappingKey = propertyValue
    if (resolvers) {
      if (!resolvers[propertyValue]) {
        throw new DiscriminatorMappingNotFoundError(
          discriminator,
          propertyValue,
          resolvers
        )
      }
      const resolverFunction = resolvers[propertyValue]
      mappingKey = resolverFunction(req, discriminator)
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
      $ref: targetSchema
    }
  }
  return schema
}

module.exports = resolveSchema
