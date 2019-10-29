module.exports = {
  $id: "fuck-off",
  oneOf: [
    {
      $ref: "#/definitions/A"
    },
    {
      $ref: "#/definitions/B"
    },
    {
      $ref: "#/definitions/C"
    }
  ],
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
    },
    C: {
      type: "object",
      properties: {
        objType: {
          type: "string",
          enum: ["C"]
        },
        cProp: {
          type: "string"
        }
      },
      required: ["objType", "cProp"]
    }
  }
}
