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
  resolvers?: {
    [key: string]: (
      req: express.Request,
      discriminator: {
        propertyName: string
        mapping: {
          [key: string]: string
        }
      }
    ) => void
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

export interface DiscriminatorMappingNotFoundError extends Error {
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
  DiscriminatorMappingNotFoundError: {
    new (
      discriminator: object,
      propertyValue: string,
      resolvers: object
    ): DiscriminatorMappingNotFoundError
  }
}

export default middleware
