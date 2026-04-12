import z from 'zod'
import type { ListLessonsQueryDto } from '../dtos'
import { LessonsApiConstraints } from '../enums'

export const listLessonsQuerySchema = z
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
	.optional() satisfies z.ZodType<ListLessonsQueryDto | undefined>
