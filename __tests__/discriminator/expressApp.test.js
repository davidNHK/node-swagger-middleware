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
      },
      resolvers: {
        normal: (req, discriminator) => `super${req.body.type}`,
        admin: (req, discriminator) => `super${req.body.type}`
      }
    })
  })

  it("Post all route ", async () => {
    const response1 = await request(app)
      .post("/v1/user")
      .send({
        type: "normal"
      })
    expect(response1.status).toEqual(200)
    const response2 = await request(app)
      .post("/v1/user")
      .send({
        type: "admin",
        staffId: "foobar"
      })
    expect(response2.status).toEqual(200)
  })

  it("Post a normal user", async () => {
    const response = await request(app)
      .post("/v1/user")
      .send({
        type: "normal"
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
