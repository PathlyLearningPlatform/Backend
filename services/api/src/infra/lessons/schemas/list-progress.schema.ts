import { z } from 'zod';
import { LessonsApiConstraints } from '../enums';

export const listLessonProgressSchema = z
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
				userId: z.uuid().optional(),
				unitId: z.uuid().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
