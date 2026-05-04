import z from 'zod';
import { SectionProgressApiConstraints } from '../enums';
import { learningPathIdSchema } from './fields.schema';

export const listSectionProgressQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.max(SectionProgressApiConstraints.MAX_LIMIT)
			.min(SectionProgressApiConstraints.MIN_LIMIT)
			.default(SectionProgressApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(SectionProgressApiConstraints.DEFAULT_PAGE),
		learningPathId: learningPathIdSchema,
	})
	.optional();
