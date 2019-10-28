const swaggerCombine = require("swagger-combine")

const user = {
  email: {
    type: "string"
  },
  type: {
    type: "string"
  },
  subType: { type: "string" }
}

const userA = {
  telphone: {
    type: "string"
  }
}

const userB = {
  address: {
    type: "string"
  }
}

const schema = {
  openapi: "3.0.0",
  info: {
    title: "Example for discriminator",
    version: "1.0.0"
  },
  basePath: "/v1",
  servers: [{ url: "/v1" }],
  components: {
    schemas: {
      NormalUser: {
        oneOf: [
          { $ref: "#/components/schemas/NormalUserA" },
          { $ref: "#/components/schemas/NormalUserB" }
        ],
        discriminator: {
          propertyName: "subType",
          mapping: {
            A: "#/components/schemas/NormalUserA",
            B: "#/components/schemas/NormalUserB"
          }
        },
        required: ["type", "subType"]
      },
      NormalUserA: {
        type: "object",
        properties: {
          ...user,
          ...userA
        },
        required: ["type", "telphone"]
      },
      NormalUserB: {
        type: "object",
        properties: {
          ...user,
          ...userB
        },
        required: ["type", "address"]
      },
      AdminUser: {
        type: "object",
        properties: {
          ...user,
          staffId: {
            type: "string"
          }
        },
        required: ["type"]
      }
    }
  },
  paths: {
    "/user": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/NormalUser"
                  },
                  {
                    $ref: "#/components/schemas/AdminUser"
                  }
                ],
                discriminator: {
                  propertyName: "type",
                  mapping: {
                    normal: "#/components/schemas/NormalUser",
                    admin: "#/components/schemas/AdminUser"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Dynamic response payload",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    {
                      $ref: "#/components/schemas/NormalUser"
                    },
                    {
                      $ref: "#/components/schemas/AdminUser"
                    }
                  ],
                  discriminator: {
                    propertyName: "type",
                    mapping: {
                      normal: "#/components/schemas/NormalUser",
                      admin: "#/components/schemas/AdminUser"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

module.exports = schema

if (require.main === module) {
  swaggerCombine(schema).then(combineSchema => {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(combineSchema, null, 4))
  })
}
