import { SortType } from '@pathly-backend/common/index.js'
import z from 'zod'
import {
	LearningPathsApiConstraints,
	LearningPathsOrderByFields,
} from '@/learning-paths/enums'

export const findLearningPathsQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.min(LearningPathsApiConstraints.MIN_LIMIT)
			.max(LearningPathsApiConstraints.MAX_LIMIT)
			.default(LearningPathsApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(LearningPathsApiConstraints.DEFAULT_PAGE),
		orderBy: z
			.enum(LearningPathsOrderByFields)
			.default(LearningPathsOrderByFields.CREATED_AT),
		sortType: z.enum(SortType).default(SortType.DESC),
	})
	.strict()
	.optional()
