import { ApiPropertyOptional } from '@nestjs/swagger'
import { ActivitiesApiConstraints } from '../enums'

export class UpdateActivityDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: ActivitiesApiConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: ActivitiesApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null

	@ApiPropertyOptional({
		type: 'number',
	})
	order?: number

	@ApiPropertyOptional({
		type: 'string',
	})
	lessonId?: string
}
