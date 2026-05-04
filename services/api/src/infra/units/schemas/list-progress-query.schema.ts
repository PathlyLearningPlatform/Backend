import z from 'zod';
import { UnitProgressApiConstraints } from '../enums';
import { sectionIdSchema } from './fields.schema';

export const listUnitProgressQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.max(UnitProgressApiConstraints.MAX_LIMIT)
			.min(UnitProgressApiConstraints.MIN_LIMIT)
			.default(UnitProgressApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(UnitProgressApiConstraints.DEFAULT_PAGE),
		sectionId: sectionIdSchema.optional(),
	})
	.optional();
