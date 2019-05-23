import * as ajv from "ajv"
import * as express from "express"
import * as sway from "sway"

interface CreateMiddlewareOptions {
  swayOptions?: sway.CreateOptions
  swayValidateRequestOptions?: sway.RequestValidationOptions
  swayValidateResponseOptions?: sway.ResponseValidationOptions
  ajvRequestOptions?: ajv.Options
  ajvResponseOptions?: ajv.Options
  middlewareOptions?: {
    strictMode: boolean
  }
}

interface ValidationError extends Error {
  errors: sway.ValidationEntry[]
  new (swayError: sway.ValidationResults)
}
interface AJVValidationError extends Error {
  errors: ajv.ErrorObject[]
  new (ajvError: ajv.ErrorObject[])
}
interface SpecNotFoundError extends Error {
  new (method: string, path: string)
}

interface CreateExpressMiddleware {
  (swaggerIndexFile: string, options: CreateMiddlewareOptions): Promise<
    express.RequestHandler
  >
}

declare const middleware: {
  createExpressMiddleware: CreateExpressMiddleware
  ValidationError: ValidationError
  AJVValidationError: AJVValidationError
  SpecNotFoundError: SpecNotFoundError
}

export = middleware
