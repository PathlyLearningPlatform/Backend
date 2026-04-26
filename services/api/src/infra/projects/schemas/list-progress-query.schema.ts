import { ProjectStatus } from '@/domain/projects';
import z from 'zod';
import type { ListProjectProgressQueryDto } from '../dtos';
import { ProjectApiConstraints } from '../enums';

export const listProjectProgressQuerySchema = z
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
		status: z.enum(ProjectStatus).optional(),
	})
	.optional() satisfies z.ZodType<ListProjectProgressQueryDto | undefined>;
