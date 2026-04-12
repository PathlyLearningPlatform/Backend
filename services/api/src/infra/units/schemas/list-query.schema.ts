import z from 'zod'
import type { ListUnitsQueryDto } from '../dtos'
import { UnitsApiConstraints } from '../enums'

export const listUnitsQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.min(UnitsApiConstraints.MIN_LIMIT)
			.max(UnitsApiConstraints.MAX_LIMIT)
			.default(UnitsApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(UnitsApiConstraints.DEFAULT_PAGE),
	})
	.optional() satisfies z.ZodType<ListUnitsQueryDto | undefined>
