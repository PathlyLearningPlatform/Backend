import { ApiProperty } from '@nestjs/swagger'
import { LessonConstraints } from '@/domain/lessons/enums'

export class LessonResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	id: string

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	unitId: string

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

	@ApiProperty({
		type: 'string',
		maxLength: LessonConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiProperty({
		type: 'string',
		maxLength: LessonConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description: string | null

	@ApiProperty({
		type: 'number',
	})
	order: number
}
