import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorDto {
	@ApiProperty()
	public readonly message: string;

	@ApiProperty({ type: 'string', format: 'date-time' })
	public readonly timestamp: string;

	@ApiProperty({ nullable: true })
	public readonly details: unknown | null;

	constructor(message: string, details: unknown | null = null) {
		this.message = message;
		this.details = details;
		this.timestamp = new Date().toISOString();
	}
}
