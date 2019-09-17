const swaggerCombine = require("swagger-combine")

const user = {
  email: {
    type: "string"
  },
  type: {
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
        type: "object",
        properties: {
          ...user
        },
        required: ["type"]
      },
      AdminUser: {
        type: "object",
        properties: {
          ...user,
          staffId: {
            type: "string"
          }
        },
        required: ["type", "staffId"]
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
                    supernormal: "#/components/schemas/NormalUser",
                    superadmin: "#/components/schemas/AdminUser"
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
                      supernormal: "#/components/schemas/NormalUser",
                      superadmin: "#/components/schemas/AdminUser"
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
