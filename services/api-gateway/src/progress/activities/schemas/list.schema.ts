import z from 'zod'
import { ActivityProgressConstraints } from '../enums'

export const listActivityProgressSchema = z
	.object({
		limit: z.coerce
			.number()
			.max(ActivityProgressConstraints.MAX_LIMIT)
			.min(ActivityProgressConstraints.MIN_LIMIT)
			.default(ActivityProgressConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(ActivityProgressConstraints.DEFAULT_PAGE),
	})
	.strict()
	.optional()
