import { ApiProperty } from '@nestjs/swagger'
import { LearningPathConstraints } from '@/domain/learning-paths/enums'

export class CreateLearningPathBodyDto {
	@ApiProperty({
		type: 'string',
		maxLength: LearningPathConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiProperty({
		type: 'string',
		maxLength: LearningPathConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null
}
