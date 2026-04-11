import z from 'zod'
import { UnitProgressConstraints } from '../enums'

export const listUnitProgressSchema = z
	.object({
		limit: z.coerce
			.number()
			.max(UnitProgressConstraints.MAX_LIMIT)
			.min(UnitProgressConstraints.MIN_LIMIT)
			.default(UnitProgressConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(UnitProgressConstraints.DEFAULT_PAGE),
	})
	.optional()
