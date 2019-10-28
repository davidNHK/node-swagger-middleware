class BaseError extends Error {}

class ValidationError extends BaseError {
  constructor(swayError) {
    super(
      swayError.errors
        .map((error, index) => {
          return `Error ${index}
${JSON.stringify(error, null, 4)}`
        })
        .join("\n\n")
    )
    this.errors = swayError.errors
  }
}

class AJVValidationError extends BaseError {
  constructor(ajvError) {
    super(
      ajvError
        .map((error, index) => {
          return `Error ${index}
${JSON.stringify(error, null, 4)}`
        })
        .join("\n\n")
    )
    this.errors = ajvError
  }
}

class SpecNotFoundError extends BaseError {
  constructor(method, path) {
    super(`No matched spec found for ${method} ${path}`)
    this.method = method
    this.path = path
  }
}

class DiscriminatorReferenceNotFoundError extends BaseError {
  constructor(discriminator, valueToBeRef) {
    super(`Discriminator mapping not found`)
    this.discriminator = discriminator
    this.valueToBeRef = valueToBeRef
  }
}

module.exports = {
  BaseError,
  ValidationError,
  SpecNotFoundError,
  AJVValidationError,
  DiscriminatorReferenceNotFoundError
}
