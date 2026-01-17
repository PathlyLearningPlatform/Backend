export class GrpcErrorDto {
  public readonly message: string;
  public readonly details: unknown | null;
  public readonly code: number;
  public readonly apiCode: string;

  constructor(message: string, code: number, apiCode: string, details: unknown = null) {
    this.message = message;
    this.details = details;
    this.code = code;
    this.apiCode = apiCode
  }
}