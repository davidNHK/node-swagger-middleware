const swaggerCombine = require("swagger-combine")
const express = require("express")

const { createExpressMiddleware } = require("../../lib")
const {
  ValidationError,
  SpecNotFoundError,
  AJVValidationError,
  DiscriminatorReferenceNotFoundError
} = require("../../lib/errors")

const swagger = require("./swagger")

module.exports.createExpressApp = async middlewareOptions => {
  const app = express()
  const schema = await swaggerCombine(swagger)
  app.use(express.json())
  app.use(await createExpressMiddleware(schema, middlewareOptions))

  app.post("/v1/user", (req, res) => {
    res.send(req.body)
  })

  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      res.status(400)
    } else if (err instanceof SpecNotFoundError) {
      res.status(404)
    } else if (err instanceof AJVValidationError) {
      res.status(400)
    } else if (err instanceof DiscriminatorReferenceNotFoundError) {
      res.status(400)
    } else {
      res.status(500)
    }
    res.send({
      err
    })
    next()
  })
  return app
}
