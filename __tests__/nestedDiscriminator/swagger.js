const swaggerCombine = require("swagger-combine")

const admin = {
  email: {
    type: "string"
  },
  type: {
    type: "string"
  },
  staffId: {
    type: "string"
  }
}

const staff = {
  email: {
    type: "string"
  },
  type: {
    type: "string"
  }
}

const normalStaff = {
  ...staff,
  telephone: {
    type: "string"
  },
  subType: { type: "string" }
}

const supervisorStaff = {
  ...staff,
  address: {
    type: "string"
  },
  subType: { type: "string" }
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
      Staff: {
        type: "object",
        oneOf: [
          { $ref: "#/components/schemas/NormalStaff" },
          { $ref: "#/components/schemas/SupervisorStaff" }
        ],
        discriminator: {
          propertyName: "subType",
          mapping: {
            A: "#/components/schemas/NormalStaff",
            B: "#/components/schemas/SupervisorStaff"
          }
        },
        required: ["subType"]
      },
      NormalStaff: {
        type: "object",
        properties: normalStaff,
        required: ["telephone"]
      },
      SupervisorStaff: {
        type: "object",
        properties: supervisorStaff,
        required: ["address"]
      },
      Admin: {
        type: "object",
        properties: {
          ...admin
        },
        required: ["type"]
      }
    }
  },
  paths: {
    "/user": {
      post: {
        operationId: "createUser",
        tags: ["user"],
        description: "Endpoint for create user",
        requestBody: {
          description: "Create User Payload",
          content: {
            "application/json": {
              schema: {
                type: "object",
                oneOf: [
                  {
                    $ref: "#/components/schemas/Staff"
                  },
                  {
                    $ref: "#/components/schemas/Admin"
                  }
                ],
                discriminator: {
                  propertyName: "type",
                  mapping: {
                    staff: "#/components/schemas/Staff",
                    admin: "#/components/schemas/Admin"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Create user response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  oneOf: [
                    {
                      $ref: "#/components/schemas/Staff"
                    },
                    {
                      $ref: "#/components/schemas/Admin"
                    }
                  ],
                  discriminator: {
                    propertyName: "type",
                    mapping: {
                      staff: "#/components/schemas/Staff",
                      admin: "#/components/schemas/Admin"
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
