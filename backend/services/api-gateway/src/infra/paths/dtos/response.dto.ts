import { PathConstraints } from '@/domain/paths/enums'
import { ApiProperty } from '@nestjs/swagger'

export class PathResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	id: string

	@ApiProperty({
		type: 'string',
		maxLength: PathConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiProperty({
		type: 'string',
		maxLength: PathConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description: string | null

	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createdAt: string

	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	updatedAt: string
}
