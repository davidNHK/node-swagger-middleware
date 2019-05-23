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

export interface ValidationError extends Error {
  errors: sway.ValidationEntry[]
}
export interface AJVValidationError extends Error {
  errors: ajv.ErrorObject[]
}
export interface SpecNotFoundError extends Error {
  method: string
  path: string
}

interface CreateExpressMiddleware {
  (swaggerObject: object, options?: CreateMiddlewareOptions): Promise<
    express.RequestHandler
  >
}

declare const middleware: {
  createExpressMiddleware: CreateExpressMiddleware
  ValidationError: { new (swayError: sway.ValidationResults): ValidationError }
  AJVValidationError: { new (ajvError: ajv.ErrorObject[]): AJVValidationError }
  SpecNotFoundError: { new (method: string, path: string): SpecNotFoundError }
}

export default middleware
