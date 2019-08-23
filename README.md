# node-swagger-middleware

[![codecov](https://codecov.io/gh/davidNHK/node-swagger-middleware/branch/development/graph/badge.svg)](https://codecov.io/gh/davidNHK/node-swagger-middleware)
[![Build Status](https://travis-ci.org/davidNHK/node-swagger-middleware.svg?branch=development)](https://travis-ci.org/davidNHK/node-swagger-middleware)
[![npm version](https://badge.fury.io/js/node-swagger-middleware.svg)](https://badge.fury.io/js/node-swagger-middleware)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Project on top of [sway](https://github.com/apigee-127/sway) and [swagger-combine](https://github.com/maxdome/swagger-combine)
to provide middleware for express request/response validate

## Installation

```sh
yarn add node-swagger-middleware
```

## Example Usage

Express [Example App](./__tests__/expressApp.js)

```js
const express = require("express")
const swaggerCombine = require("swagger-combine")
const {
  createExpressMiddleware,
  ValidationError
} = require("node-swagger-middleware")

createExpressApp = async () => {
  const app = express()
  const swaggerFile = await swaggerCombine(`${__dirname}/swagger/index.yml`)
  app.use(express.json())
  app.use(await createExpressMiddleware(swaggerFile))
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
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
```

## TODO

Support default value, type casing on request parameters
