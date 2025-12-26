import z from 'zod'
import type { FindUnitsQueryDto } from '../dtos'
import { UnitsApiConstraints } from '../enums'

export const findUnitsQuerySchema = z
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
	.strict()
	.optional() satisfies z.ZodType<FindUnitsQueryDto | undefined>
