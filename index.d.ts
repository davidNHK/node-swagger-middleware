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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseError extends Error {}

export interface ValidationError extends BaseError {
  errors: sway.ValidationEntry[]
}
export interface AJVValidationError extends BaseError {
  errors: ajv.ErrorObject[]
}
export interface SpecNotFoundError extends BaseError {
  method: string
  path: string
}

export interface DiscriminatorMappingNotFoundError extends BaseError {
  discriminator: object
  propertyValue: string
  resolvers: object
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
  BaseError: { new (): BaseError }
  DiscriminatorMappingNotFoundError: {
    new (
      discriminator: object,
      propertyValue: string,
      resolvers: object
    ): DiscriminatorMappingNotFoundError
  }
}

export default middleware
