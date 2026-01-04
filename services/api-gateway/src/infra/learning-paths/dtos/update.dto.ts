import { ApiPropertyOptional } from '@nestjs/swagger'
import { LearningPathConstraints } from '@/domain/learning-paths/enums'

export class UpdateLearningPathBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: LearningPathConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: LearningPathConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null
}
