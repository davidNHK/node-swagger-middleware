function toJSONSchema(id, swaggerSchema) {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: id,
    ...swaggerSchema
  }
}

module.exports = toJSONSchema
