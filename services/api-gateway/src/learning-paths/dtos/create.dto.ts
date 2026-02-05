import { ApiProperty } from '@nestjs/swagger'
import { LearningPathsApiConstraints } from '@/learning-paths/enums'

export class CreateLearningPathBodyDto {
	@ApiProperty({
		type: 'string',
		maxLength: LearningPathsApiConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiProperty({
		type: 'string',
		maxLength: LearningPathsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null
}
