import { emptyStringToNull } from '@infra/common';
import { z } from 'zod';
import {
	descriptionSchema,
	difficultySchema,
	lessonIdSchema,
	nameSchema,
} from './fields.schema';

export const createExerciseSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.nullable().optional().default(null),
		),
		lessonId: lessonIdSchema,
		difficulty: difficultySchema,
	})
	.strict();
