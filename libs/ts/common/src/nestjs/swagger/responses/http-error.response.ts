import { ApiProperty } from "@nestjs/swagger";
import { HttpErrorDto } from "../../../dtos";

export class HttpErrorResponse extends HttpErrorDto {
  @ApiProperty()
  public readonly message: string

  @ApiProperty()
  public readonly details: unknown | null

  @ApiProperty({type: 'string', format: 'date-time'})
  public readonly timestamp: string;

  constructor(message: string, details: unknown | null = null) {
    super(message, details)

    this.message = message;
    this.details = details;
    this.timestamp = new Date().toISOString()
  }
}