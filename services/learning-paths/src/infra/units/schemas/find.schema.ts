import { z } from 'zod';
import { UnitsApiConstraints } from '../enums';

export const findUnitsSchema = z
	.object({
		options: z
			.object({
				limit: z
					.int32()
					.min(UnitsApiConstraints.MIN_LIMIT)
					.max(UnitsApiConstraints.MAX_LIMIT)
					.optional()
					.default(UnitsApiConstraints.DEFAULT_LIMIT),
				page: z
					.int32()
					.nonnegative()
					.optional()
					.default(UnitsApiConstraints.DEFAULT_PAGE),
			})
			.strict()
			.optional(),
	})
	.strict();
