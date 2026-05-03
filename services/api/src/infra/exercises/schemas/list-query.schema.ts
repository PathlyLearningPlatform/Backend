import z from 'zod';
import type { ListExercisesDto } from '../dtos';
import { ExerciseApiConstraints } from '../enums';

export const listExercisesQuerySchema = z
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
	})
	.optional() satisfies z.ZodType<ListExercisesDto | undefined>;
