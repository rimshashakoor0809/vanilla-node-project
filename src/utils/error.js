export class AppError extends Error {

  constructor(message = 'Something went wrong', statusCode = 500) {
    super(message);
    this.status = statusCode;
    this.success = false;
    this.isOperational = true;
  }
}