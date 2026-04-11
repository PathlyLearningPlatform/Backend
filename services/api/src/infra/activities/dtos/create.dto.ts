import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ActivitiesApiConstraints } from '../enums'

export class CreateActivityDto {
	@ApiProperty({
		type: 'string',
		maxLength: ActivitiesApiConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: ActivitiesApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	lessonId: string
}
