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
		description: descriptionSchema.nullable().optional().default(null),
		lessonId: lessonIdSchema,
		difficulty: difficultySchema,
	})
	.strict();
