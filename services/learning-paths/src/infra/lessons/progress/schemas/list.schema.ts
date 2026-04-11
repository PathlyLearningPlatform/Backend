import z from 'zod'
import { LessonProgressConstraints } from '../enums'

export const listLessonProgressSchema = z
	.object({
		limit: z.coerce
			.number()
			.max(LessonProgressConstraints.MAX_LIMIT)
			.min(LessonProgressConstraints.MIN_LIMIT)
			.default(LessonProgressConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(LessonProgressConstraints.DEFAULT_PAGE),
	})
	.optional()
