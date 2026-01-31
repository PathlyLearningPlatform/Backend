import { ApiPropertyOptional } from '@nestjs/swagger'
import { ActivitiesApiConstraints } from '../enums'

export class FindActivitiesQueryDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: ActivitiesApiConstraints.MIN_LIMIT,
		maximum: ActivitiesApiConstraints.MAX_LIMIT,
		default: ActivitiesApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number

	@ApiPropertyOptional({
		type: 'number',
		minimum: ActivitiesApiConstraints.MIN_LIMIT,
		default: ActivitiesApiConstraints.DEFAULT_PAGE,
	})
	page?: number
}
