import z from 'zod';
import type { ListProjectsDto } from '../dtos';
import { ProjectApiConstraints } from '../enums';

export const listProjectsQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.int()
			.positive()
			.default(ProjectApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.int()
			.nonnegative()
			.default(ProjectApiConstraints.DEFAULT_PAGE),
	})
	.optional() satisfies z.ZodType<ListProjectsDto | undefined>;
