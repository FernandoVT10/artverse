export class ServerError extends Error {
  public statusCode: number;

  constructor(message?: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  public statusCode: number;
  public field: string;

  constructor(message: string, field: string) {
    super(message);
    this.statusCode = 400;
    this.field = field;
  }
}
