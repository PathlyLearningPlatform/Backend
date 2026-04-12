import z from 'zod';
import { ActivityProgressApiConstraints } from '../enums';

export const listActivityProgressQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.max(ActivityProgressApiConstraints.MAX_LIMIT)
			.min(ActivityProgressApiConstraints.MIN_LIMIT)
			.default(ActivityProgressApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(ActivityProgressApiConstraints.DEFAULT_PAGE),
	})
	.optional();
