export class GrpcErrorDto {
  public readonly message: string;
  public timestamp?: string;
  public readonly details: unknown | null;
  public readonly code: number;

  constructor(message: string, code: number, details: unknown = null) {
    this.message = message;
    this.details = details;
    this.code = code;
  }

  setTimestamp() {
    this.timestamp = new Date().toISOString()
  }
}