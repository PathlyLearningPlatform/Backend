import z from 'zod'
import type { FindSectionsQueryDto } from '../dtos'
import { SectionsApiConstraints } from '../enums'

export const findSectionsQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.min(SectionsApiConstraints.MIN_LIMIT)
			.max(SectionsApiConstraints.MAX_LIMIT)
			.default(SectionsApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(SectionsApiConstraints.DEFAULT_PAGE),
	})
	.optional() satisfies z.ZodType<FindSectionsQueryDto | undefined>
