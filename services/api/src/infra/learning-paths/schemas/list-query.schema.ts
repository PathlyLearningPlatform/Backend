import z from 'zod';
import { LearningPathsApiConstraints } from '@infra/learning-paths/enums';

export const listLearningPathsQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.min(LearningPathsApiConstraints.MIN_LIMIT)
			.max(LearningPathsApiConstraints.MAX_LIMIT)
			.default(LearningPathsApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(LearningPathsApiConstraints.DEFAULT_PAGE),
	})
	.optional();
