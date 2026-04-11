import { ApiPropertyOptional } from '@nestjs/swagger'
import { LearningPathsApiConstraints } from '@infra/learning-paths/enums'

export class UpdateLearningPathBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: LearningPathsApiConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: LearningPathsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null
}
