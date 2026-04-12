import z from 'zod';
import { UnitProgressApiConstraints } from '../enums';

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
	})
	.optional();
