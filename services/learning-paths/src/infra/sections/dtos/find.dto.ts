import { ApiPropertyOptional } from '@nestjs/swagger'
import { SectionsApiConstraints } from '../enums'

export class FindSectionsQueryDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: SectionsApiConstraints.MIN_LIMIT,
		maximum: SectionsApiConstraints.MAX_LIMIT,
		default: SectionsApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number

	@ApiPropertyOptional({
		type: 'number',
		minimum: SectionsApiConstraints.MIN_LIMIT,
		default: SectionsApiConstraints.DEFAULT_PAGE,
	})
	page?: number
}
