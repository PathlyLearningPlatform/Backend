import z from 'zod';
import { LessonProgressApiConstraints } from '../enums';
import { unitIdSchema } from './fields.schema';

export const listLessonProgressQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.max(LessonProgressApiConstraints.MAX_LIMIT)
			.min(LessonProgressApiConstraints.MIN_LIMIT)
			.default(LessonProgressApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(LessonProgressApiConstraints.DEFAULT_PAGE),
		unitId: unitIdSchema.optional(),
	})
	.optional();
