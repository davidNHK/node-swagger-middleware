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

  it("Post a normal user A", async () => {
    const response = await request(app)
      .post("/v1/user")
      .send({
        type: "normal",
        subType: "A",
        telephone: "1234567"
      })
    expect(response.status).toEqual(200)
  })

  it("Post a admin user", async () => {
    const response = await request(app)
      .post("/v1/user")
      .send({
        type: "admin",
        staffId: "foobar"
      })
    expect(response.status).toEqual(200)
  })

  it("Post a incorrect type of user", async () => {
    const response = await request(app)
      .post("/v1/user")
      .send({
        type: "pepe the frog",
        staffId: "foobar"
      })
    expect(response.status).toEqual(400)
  })
})
