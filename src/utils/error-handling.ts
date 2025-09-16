export default class CreateUserError extends Error {
  statusCode: number;
  message: string;
  code: string;
  details?: string;

  constructor(statusCode: number, message: string, code: string, details: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
    this.details = details;
  }
}
