const request = require("supertest")

const { createExpressApp } = require("./expressApp")

describe("Test Express Middleware", () => {
  let app
  beforeEach(async () => {
    app = await createExpressApp({
      swayValidateRequestOptions: {
        formData: true,
        query: true,
        header: false
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

  it("Post a path with default parameter", async () => {
    const response = await request(app)
      .post("/v1/whoami")
      .send({ name: "test", purpose: "purpose" })
    expect(response.status).toEqual(200)
  })

  it("Post a path with no required name parameter", async () => {
    const response = await request(app)
      .post("/v1/whoami")
      .send({ purpose: "purpose" })
    expect(response.status).toEqual(400)
  })

  it("Post a path with empty object", async () => {
    const response = await request(app)
      .post("/v1/whoami")
      .send({})
    expect(response.status).toEqual(400)
  })

  it("Post a path with nothing", async () => {
    const response = await request(app)
      .post("/v1/whoami")
      .send()
    expect(response.status).toEqual(400)
  })
})
