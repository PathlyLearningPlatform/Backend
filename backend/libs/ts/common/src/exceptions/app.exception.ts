export class AppException extends Error {
  constructor(
    public readonly message: string,
    public readonly isOperational: boolean,
    public readonly cause: unknown = null,
  ) {
    super(message, {
      cause,
    });
  }
}
