const _ = require("lodash")
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
                    $ref: "#/components/schemas/Admin"
                  },
                  {
                    $ref: "#/components/schemas/Staff"
                  }
                ],
                discriminator: {
                  propertyName: "type",
                  mapping: {
                    admin: "#/components/schemas/Admin",
                    staff: "#/components/schemas/Staff"
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
                      $ref: "#/components/schemas/Admin"
                    },
                    {
                      $ref: "#/components/schemas/Staff"
                    }
                  ],
                  discriminator: {
                    propertyName: "type",
                    mapping: {
                      admin: "#/components/schemas/Admin",
                      staff: "#/components/schemas/Staff"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Staff: {
        title: "Staff",
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
        title: "NormalStaff",
        properties: normalStaff,
        required: ["telephone"]
      },
      SupervisorStaff: {
        title: "SupervisorStaff",
        properties: supervisorStaff,
        required: ["address"]
      },
      Admin: {
        title: "Admin",
        type: "object",
        properties: {
          ...admin
        },
        required: ["type"]
      }
    }
  }
}

module.exports = schema

function deepOmit(target, omitPaths = []) {
  return _.reduce(
    target,
    (acc, value, key) => {
      if (!omitPaths.includes(key)) {
        if (_.isPlainObject(value)) {
          return Object.assign(acc, { [key]: deepOmit(value, omitPaths) })
        }
        if (_.isArray(value)) {
          return Object.assign(acc, {
            [key]: _.map(value, value => {
              if (_.isPlainObject(value)) {
                return deepOmit(value, omitPaths)
              }
              return value
            })
          })
        }
        return Object.assign(acc, { [key]: value })
      }
      return acc
    },
    {}
  )
}

module.exports.deepOmit = deepOmit

if (require.main === module) {
  swaggerCombine(schema).then(combineSchema => {
    // Because redoc not support nested discriminator
    const schema = deepOmit(combineSchema, ["discriminator"])
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(schema, null, 4))
  })
}
