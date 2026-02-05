import { ApiPropertyOptional } from '@nestjs/swagger'
import { SortType } from '@pathly-backend/common/index.js'
import {
	LearningPathsOrderByFields,
	LearningPathsApiConstraints,
} from '@/learning-paths/enums'

export class FindLearningPathsQueryDto {
	@ApiPropertyOptional({
		type: 'number',
		minimum: LearningPathsApiConstraints.MIN_LIMIT,
		maximum: LearningPathsApiConstraints.MAX_LIMIT,
		default: LearningPathsApiConstraints.DEFAULT_LIMIT,
	})
	limit?: number

	@ApiPropertyOptional({
		type: 'number',
		minimum: LearningPathsApiConstraints.MIN_LIMIT,
		default: LearningPathsApiConstraints.DEFAULT_PAGE,
	})
	page?: number

	@ApiPropertyOptional({ enum: SortType, default: SortType.DESC })
	sortType?: SortType

	@ApiPropertyOptional({
		enum: LearningPathsOrderByFields,
		default: LearningPathsOrderByFields.CREATED_AT,
	})
	orderBy?: LearningPathsOrderByFields
}
