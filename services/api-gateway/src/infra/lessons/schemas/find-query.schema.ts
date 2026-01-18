import z from 'zod'
import type { FindLessonsQueryDto } from '../dtos'
import { LessonsApiConstraints } from '../enums'

export const findLessonsQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.min(LessonsApiConstraints.MIN_LIMIT)
			.max(LessonsApiConstraints.MAX_LIMIT)
			.default(LessonsApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(LessonsApiConstraints.DEFAULT_PAGE),
	})
	.strict()
	.optional() satisfies z.ZodType<FindLessonsQueryDto | undefined>
