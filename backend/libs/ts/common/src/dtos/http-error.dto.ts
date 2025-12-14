export class HttpErrorDto {
  public readonly message: string;
  public readonly timestamp: string;
  public readonly details: unknown | null;

  constructor(
    message: string,
    details: unknown | null = null) {
    this.message = message;
    this.details = details;
    this.timestamp = new Date().toISOString()
  }
}