import { SortType } from '@pathly-backend/common/index.js'
import { PathsOrderByFields } from '@domain/paths/enums'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PathsApiConstraints } from '../enums'

export class FindPathsQueryDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: PathsApiConstraints.MIN_LIMIT,
		maximum: PathsApiConstraints.MAX_LIMIT,
		default: PathsApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number

	@ApiPropertyOptional({
		type: 'number',
		minimum: PathsApiConstraints.MIN_LIMIT,
		default: PathsApiConstraints.DEFAULT_PAGE,
	})
	page?: number

	@ApiPropertyOptional({ enum: SortType, default: SortType.DESC })
	sortType?: SortType

	@ApiPropertyOptional({
		enum: PathsOrderByFields,
		default: PathsOrderByFields.CREATED_AT,
	})
	orderBy?: PathsOrderByFields
}
