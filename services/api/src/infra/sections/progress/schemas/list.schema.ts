import z from 'zod'
import { SectionProgressConstraints } from '../enums'

export const listSectionProgressSchema = z
	.object({
		limit: z.coerce
			.number()
			.max(SectionProgressConstraints.MAX_LIMIT)
			.min(SectionProgressConstraints.MIN_LIMIT)
			.default(SectionProgressConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(SectionProgressConstraints.DEFAULT_PAGE),
	})
	.optional()
