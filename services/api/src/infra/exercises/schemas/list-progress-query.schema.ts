import { ExerciseStatus } from '@/domain/exercises';
import z from 'zod';
import type { ListExerciseProgressQueryDto } from '../dtos';
import { ExerciseApiConstraints } from '../enums';

export const listExerciseProgressQuerySchema = z
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
		status: z.enum(ExerciseStatus).optional(),
	})
	.optional() satisfies z.ZodType<ListExerciseProgressQueryDto | undefined>;
