export class GrpcErrorDto {
  public readonly message: string;
  public readonly details: unknown | null;
  public readonly code: number;
  public readonly apiCode: number | null;

  constructor(message: string, code: number, apiCode: number | null = null, details: unknown = null) {
    this.message = message;
    this.details = details;
    this.code = code;
    this.apiCode = apiCode
  }
}