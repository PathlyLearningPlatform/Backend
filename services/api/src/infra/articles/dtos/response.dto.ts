import { ApiProperty } from '@nestjs/swagger';

export class ArticleResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	declare id: string;

	@ApiProperty({
		type: 'string',
	})
	declare name: string;

	@ApiProperty({
		type: 'string',
		nullable: true,
	})
	declare description: string | null;

	@ApiProperty({
		type: 'string',
	})
	declare ref: string;

	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	declare createdAt: string;

	@ApiProperty({
		type: 'string',
		format: 'date-time',
		nullable: true,
	})
	declare updatedAt: string | null;
}
