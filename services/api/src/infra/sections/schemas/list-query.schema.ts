import z from 'zod';
import type { ListSectionsQueryDto } from '../dtos';
import { SectionsApiConstraints } from '../enums';
import { learningPathIdSchema } from './fields.schema';

export const listSectionsQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.min(SectionsApiConstraints.MIN_LIMIT)
			.max(SectionsApiConstraints.MAX_LIMIT)
			.default(SectionsApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.nonnegative()
			.default(SectionsApiConstraints.DEFAULT_PAGE),
		learningPathId: learningPathIdSchema.optional(),
	})
	.optional() satisfies z.ZodType<ListSectionsQueryDto | undefined>;
