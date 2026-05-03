import {
	ExerciseSubmissionConclusion,
	ExerciseSubmissionStatus,
} from '@/domain/exercises';
import z from 'zod';
import type { ListExerciseSubmissionsQueryDto } from '../dtos';
import { ExerciseApiConstraints } from '../enums';

export const listExerciseSubmissionsQuerySchema = z
	.object({
		limit: z.coerce
			.number()
			.int()
			.positive()
			.default(ExerciseApiConstraints.DEFAULT_LIMIT),
		page: z.coerce
			.number()
			.int()
			.nonnegative()
			.default(ExerciseApiConstraints.DEFAULT_PAGE),
		status: z.enum(ExerciseSubmissionStatus).optional(),
		conclusion: z.enum(ExerciseSubmissionConclusion).optional(),
	})
	.optional() satisfies z.ZodType<ListExerciseSubmissionsQueryDto | undefined>;
