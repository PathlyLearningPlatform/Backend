import { ApiProperty } from '@nestjs/swagger'
import { LessonsApiConstraints } from '@infra/lessons/enums'

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
		nullable: true,
	})
	updatedAt: string | null

	@ApiProperty({
		type: 'string',
		maxLength: LessonsApiConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiProperty({
		type: 'string',
		maxLength: LessonsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description: string | null

	@ApiProperty({
		type: 'number',
	})
	order: number

	@ApiProperty()
	activityCount: number
}
