import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import {
	descriptionSchema,
	nameSchema,
	lessonIdSchema,
	difficultySchema,
} from './fields.schema';

export const createExerciseSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		lessonId: lessonIdSchema,
		difficulty: difficultySchema,
	})
	.strict();
