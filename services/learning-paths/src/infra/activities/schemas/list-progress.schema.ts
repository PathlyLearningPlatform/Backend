import { z } from 'zod';
import { ActivitiesApiConstraints } from '../enums';

export const listActivityProgressSchema = z
	.object({
		options: z
			.object({
				limit: z
					.int32()
					.min(ActivitiesApiConstraints.MIN_LIMIT)
					.max(ActivitiesApiConstraints.MAX_LIMIT)
					.optional()
					.default(ActivitiesApiConstraints.DEFAULT_LIMIT),
				page: z
					.int32()
					.nonnegative()
					.optional()
					.default(ActivitiesApiConstraints.DEFAULT_PAGE),
			})
			.strict()
			.optional(),
		where: z
			.object({
				userId: z.uuid().optional(),
				lessonId: z.uuid().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
