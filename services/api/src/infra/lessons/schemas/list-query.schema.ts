import z from 'zod';
import type { ListLessonsQueryDto } from '../dtos';
import { LessonsApiConstraints } from '../enums';
import { unitIdSchema } from './fields.schema';

export const listLessonsQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.min(LessonsApiConstraints.MIN_LIMIT)
			.max(LessonsApiConstraints.MAX_LIMIT)
			.default(LessonsApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(LessonsApiConstraints.DEFAULT_PAGE),
		unitId: unitIdSchema.optional(),
	})
	.optional() satisfies z.ZodType<ListLessonsQueryDto | undefined>;
