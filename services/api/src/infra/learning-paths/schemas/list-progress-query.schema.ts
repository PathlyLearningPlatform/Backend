import z from 'zod';
import { LearningPathProgressApiConstraints } from '../enums';

export const listLearningPathProgressQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.max(LearningPathProgressApiConstraints.MAX_LIMIT)
			.min(LearningPathProgressApiConstraints.MIN_LIMIT)
			.default(LearningPathProgressApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(LearningPathProgressApiConstraints.DEFAULT_PAGE),
	})
	.optional();
