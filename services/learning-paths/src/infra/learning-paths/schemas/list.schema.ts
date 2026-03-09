import { z } from 'zod';
import { LearningPathsApiConstraints } from '../enums';

export const listLearningPathsSchema = z
	.object({
		options: z
			.object({
				limit: z
					.int32()
					.min(LearningPathsApiConstraints.MIN_LIMIT)
					.max(LearningPathsApiConstraints.MAX_LIMIT)
					.optional()
					.default(LearningPathsApiConstraints.DEFAULT_LIMIT),
				page: z
					.int32()
					.nonnegative()
					.optional()
					.default(LearningPathsApiConstraints.DEFAULT_PAGE),
			})
			.strict()
			.optional(),
	})
	.strict();
