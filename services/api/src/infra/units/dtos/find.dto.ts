import { ApiPropertyOptional } from '@nestjs/swagger'
import { UnitsApiConstraints } from '../enums'

export class FindUnitsQueryDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: UnitsApiConstraints.MIN_LIMIT,
		maximum: UnitsApiConstraints.MAX_LIMIT,
		default: UnitsApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number

	@ApiPropertyOptional({
		type: 'number',
		minimum: UnitsApiConstraints.MIN_LIMIT,
		default: UnitsApiConstraints.DEFAULT_PAGE,
	})
	page?: number
}
