import z from 'zod'
import { LearningPathProgressConstraints } from '../enums'

export const listLearningPathProgressSchema = z
	.object({
		limit: z.coerce
			.number()
			.max(LearningPathProgressConstraints.MAX_LIMIT)
			.min(LearningPathProgressConstraints.MIN_LIMIT)
			.default(LearningPathProgressConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(LearningPathProgressConstraints.DEFAULT_PAGE),
	})
	.optional()
