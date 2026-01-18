import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LessonConstraints } from '@/domain/lessons/enums'

export class CreateLessonBodyDto {
	@ApiProperty({
		type: 'string',
		maxLength: LessonConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: LessonConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null

	@ApiProperty({
		type: 'number',
	})
	order: number

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	unitId: string
}
