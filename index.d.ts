import * as ajv from "ajv";
import * as express from "express";
import * as sway from "sway";

export interface CreateMiddlewareOptions {
  swayOptions?: sway.CreateOptions;
  swayValidateRequestOptions?: sway.RequestValidationOptions;
  swayValidateResponseOptions?: sway.ResponseValidationOptions;
  ajvRequestOptions?: ajv.Options;
  ajvResponseOptions?: ajv.Options;
  middlewareOptions?: {
    strictMode: boolean;
  };
}
export class ValidationError extends Error {
  public errors: sway.ValidationEntry[];
  constructor(swayError: sway.ValidationResults)
}
export class AJVValidationError extends Error {
  public errors: ajv.ErrorObject[];
  constructor(ajvError: ajv.ErrorObject[]);
}
export class SpecNotFoundError extends Error {
  constructor(method: string, path: string)
}
export function createExpressMiddleware(swaggerIndexFile: string, options: CreateMiddlewareOptions):
(req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
