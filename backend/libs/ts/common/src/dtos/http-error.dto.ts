export class HttpErrorDto {
  public readonly message: string;
  public timestamp?: string;
  public readonly details: unknown | null;

  constructor(
    message: string,
    details: unknown | null = null) {
    this.message = message;
    this.details = details;
  }

  setTimestamp() {
    this.timestamp = new Date().toISOString()
  }
}