module.exports = {
  $id: "fuck-off",
  oneOf: [
    {
      $ref: "#/definitions/A"
    },
    {
      $ref: "#/definitions/B"
    }
  ],
  discriminator: {
    propertyName: "objType",
    mapping: {
      A: "#/definitions/A",
      B: "#/definitions/B"
    }
  },
  definitions: {
    A: {
      type: "object",
      properties: {
        objType: {
          type: "string",
          enum: ["A"]
        },
        bProp: {
          type: "string"
        }
      },
      required: ["objType", "aProp"]
    },
    B: {
      type: "object",
      properties: {
        objType: {
          type: "string",
          enum: ["B"]
        },
        bProp: {
          type: "string"
        }
      },
      required: ["objType", "bProp"]
    }
  }
}
