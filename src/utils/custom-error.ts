export class CustomError extends Error {
  public readonly name: string;
  public readonly code: number;

  constructor(message: string, code: number) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}
