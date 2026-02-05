import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LessonsApiConstraints } from '@/lessons/enums'

export class CreateLessonBodyDto {
	@ApiProperty({
		type: 'string',
		maxLength: LessonsApiConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: LessonsApiConstraints.MAX_DESCRIPTION_LENGTH,
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
