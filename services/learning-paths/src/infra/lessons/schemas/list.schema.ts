import { z } from 'zod';
import { LessonsApiConstraints } from '../enums';

export const listLessonsSchema = z
	.object({
		options: z
			.object({
				limit: z
					.int32()
					.min(LessonsApiConstraints.MIN_LIMIT)
					.max(LessonsApiConstraints.MAX_LIMIT)
					.optional()
					.default(LessonsApiConstraints.DEFAULT_LIMIT),
				page: z
					.int32()
					.nonnegative()
					.optional()
					.default(LessonsApiConstraints.DEFAULT_PAGE),
			})
			.strict()
			.optional(),
		where: z
			.object({
				unitId: z.uuid().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
