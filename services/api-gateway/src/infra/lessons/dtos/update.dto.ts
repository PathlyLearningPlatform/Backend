import { ApiPropertyOptional } from '@nestjs/swagger'
import { LessonConstraints } from '@/domain/lessons/enums'

export class UpdateLessonBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: LessonConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: LessonConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null

	@ApiPropertyOptional({
		type: 'number',
	})
	order?: number
}
