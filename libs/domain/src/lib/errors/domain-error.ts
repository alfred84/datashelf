/** Base class for all domain-specific errors. */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/** Thrown when login credentials are invalid. */
export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password');
  }
}

/** Thrown when attempting to register a duplicate email. */
export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

/** Thrown when an uploaded file exceeds the size limit. */
export class FileTooLargeError extends DomainError {
  constructor(maxBytes: number) {
    super(`File exceeds maximum allowed size of ${maxBytes} bytes`);
  }
}

/** Thrown when an uploaded file has an invalid type. */
export class InvalidFileTypeError extends DomainError {
  constructor() {
    super('Only CSV files are allowed');
  }
}

/** Thrown when a requested resource is not found. */
export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
  }
}

/** Thrown when a user tries to access a resource they do not own. */
export class ForbiddenError extends DomainError {
  constructor() {
    super('Access denied');
  }
}
