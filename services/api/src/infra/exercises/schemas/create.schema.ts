import { z } from 'zod';
import {
	descriptionSchema,
	difficultySchema,
	lessonIdSchema,
	nameSchema,
} from '@infra/activities/schemas/fields.schema';

export const createExerciseSchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.nullable().optional().default(null),
		lessonId: lessonIdSchema,
		difficulty: difficultySchema,
	})
	.strict();
