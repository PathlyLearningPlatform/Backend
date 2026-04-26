import { ProjectSubmissionStatus } from '@/domain/projects';
import z from 'zod';
import type { ListProjectSubmissionsQueryDto } from '../dtos';
import { ProjectApiConstraints } from '../enums';

export const listProjectSubmissionsQuerySchema = z
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
		status: z.enum(ProjectSubmissionStatus).optional(),
	})
	.optional() satisfies z.ZodType<ListProjectSubmissionsQueryDto | undefined>;
