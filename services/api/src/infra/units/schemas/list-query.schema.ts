import z from 'zod';
import type { ListUnitsQueryDto } from '../dtos';
import { UnitsApiConstraints } from '../enums';
import { sectionIdSchema } from './fields.schema';

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
		sectionId: sectionIdSchema.optional(),
	})
	.optional() satisfies z.ZodType<ListUnitsQueryDto | undefined>;
