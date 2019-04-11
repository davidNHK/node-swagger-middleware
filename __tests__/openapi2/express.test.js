const request = require("supertest")

const { createExpressApp } = require("./expressApp")

describe("Test Express Middleware", () => {
  let app
  beforeEach(async () => {
    app = await createExpressApp({
      swayValidateRequestOptions: {
        strictMode: {
          formData: true,
          query: true,
          header: false
        }
      },
      swayValidateResponseOptions: {
        strictMode: false
      },
      middlewareOptions: {
        strictMode: false
      },
      ajvRequestOptions: {
        useDefaults: true
      },
      ajvResponseOptions: {
        removeAdditional: true,
        coerceTypes: true
      }
    })
  })
  it("Get a path has described on OpenAPI", async () => {
    const response = await request(app).get("/v1/whoami?name=davidng")
    expect(response.status).toEqual(200)
  })

  it("Get a path has described on OpenAPI but missing parameter", async () => {
    const response = await request(app).get("/v1/whoami")
    expect(response.status).toEqual(400)
  })

  it("Get a path not described on OpenAPI in default mode", async () => {
    const response = await request(app).get("/echo")
    expect(response.status).toEqual(200)
  })

  it("Get a path not described on OpenAPI in strict mode", async () => {
    const app = await createExpressApp({
      middlewareOptions: {
        strictMode: true
      }
    })
    const response = await request(app).get("/echo")
    expect(response.status).toEqual(404)
  })

  it("Get a path has described on OpenAPI but response schema not match", async () => {
    const response = await request(app).get(
      "/v1/response-schema-mismatch?name=davidng"
    )
    expect(response.status).toEqual(400)
  })

  it("Get a path has described on OpenAPI but and get extra data", async () => {
    const response = await request(app).get(
      "/v1/response-schema-extra-data?name=davidng"
    )
    expect(response.body).toEqual({
      meta: {
        status: 200
      },
      whoareyou: "davidng"
    })
  })

  it("Get a path has described on OpenAPI but and get extra data schema include content type", async () => {
    const response = await request(app).get(
      "/v1/response-schema-extra-data-with-content-type?name=davidng"
    )
    expect(response.body).toEqual({
      meta: {
        status: 200
      },
      whoareyou: "davidng"
    })
  })
})
