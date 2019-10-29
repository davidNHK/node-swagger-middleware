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
      oneOf: [{ $ref: "#/definitions/AA" }, { $ref: "#/definitions/AB" }],
      required: ["objType", "aProp"],
      discriminator: {
        propertyName: "subObjType",
        mapping: {
          AA: "#/definitions/AA",
          AB: "#/definitions/AB"
        }
      }
    },
    AA: {
      type: "object",
      properties: {
        objType: {
          type: "string",
          enum: ["A"]
        },
        subObjType: {
          type: "string",
          enum: ["AA"]
        },
        aaProp: {
          type: "string"
        }
      },
      required: ["objType", "aaProp", "subObjType"]
    },
    AB: {
      type: "object",
      properties: {
        objType: {
          type: "string",
          enum: ["A"]
        },
        subObjType: {
          type: "string",
          enum: ["AB"]
        },
        abProp: {
          type: "string"
        }
      },
      required: ["objType", "abProp"]
    },
    B: {
      type: "object",
      oneOf: [{ $ref: "#/definitions/BA" }, { $ref: "#/definitions/BB" }],
      required: ["objType", "bProp"],
      discriminator: {
        propertyName: "subObjType",
        mapping: {
          BA: "#/definitions/BA",
          BB: "#/definitions/BB"
        }
      }
    },
    BA: {
      type: "object",
      properties: {
        objType: {
          type: "string",
          enum: ["B"]
        },
        subObjType: {
          type: "string",
          enum: ["BA"]
        },
        baProp: {
          type: "string"
        }
      },
      required: ["objType", "baProp", "subObjType"]
    },
    BB: {
      type: "object",
      properties: {
        objType: {
          type: "string",
          enum: ["B"]
        },
        subObjType: {
          type: "string",
          enum: ["BB"]
        },
        bbProp: {
          type: "string"
        }
      },
      required: ["objType", "bbProp", "subObjType"]
    }
  }
}
