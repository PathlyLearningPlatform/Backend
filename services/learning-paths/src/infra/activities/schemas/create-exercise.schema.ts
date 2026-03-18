import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import {
	descriptionSchema,
	nameSchema,
	lessonIdSchema,
	difficultySchema,
} from './fields.schema';
import { clientExerciseDifficultyToDomain } from '../helpers';

export const createExerciseSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		lessonId: lessonIdSchema,
		difficulty: z.preprocess(
			clientExerciseDifficultyToDomain,
			difficultySchema,
		),
	})
	.strict();
