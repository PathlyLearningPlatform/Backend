import { ApiPropertyOptional } from '@nestjs/swagger'
import { LessonsApiConstraints } from '@/lessons/enums'

export class UpdateLessonBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: LessonsApiConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: LessonsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null

	@ApiPropertyOptional({
		type: 'number',
	})
	order?: number
}
