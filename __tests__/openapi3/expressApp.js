const express = require("express")

const { createExpressMiddleware } = require("../../lib")
const {
  ValidationError,
  SpecNotFoundError,
  AJVValidationError
} = require("../../lib/errors")

module.exports.createExpressApp = async middlewareOptions => {
  const app = express()
  app.use(express.json())
  app.use(
    await createExpressMiddleware(
      `${__dirname}/../fixtures/openapi3/index.yml`,
      middlewareOptions
    )
  )
  app.get("/v1/whoami", (req, res) => {
    const { name } = req.query
    res.send({
      name: "Unit Testing",
      purpose: "Middleware for integrate express and OpenAPI",
      whoareyou: name
    })
  })

  app.post("/v1/whoami", (req, res) => {
    const { name } = req.body
    res.send({
      name: "Unit Testing",
      purpose: "Middleware for integrate express and OpenAPI",
      whoareyou: name
    })
  })

  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      res.status(400)
    } else if (err instanceof SpecNotFoundError) {
      res.status(404)
    } else if (err instanceof AJVValidationError) {
      res.status(400)
    } else {
      res.status(500)
    }
    res.send({
      err
    })
  })
  return app
}
