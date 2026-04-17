import { z } from 'zod';
import {
	descriptionSchema,
	difficultySchema,
	lessonIdSchema,
	nameSchema,
	questionContentSchema,
	questionCorrectAnswerSchema,
} from './fields.schema';

export const updateActivitySchema = z.object({
	name: nameSchema.optional(),
	description: descriptionSchema.optional().nullable(),
	lessonId: lessonIdSchema.optional(),
});

export const updateExercisePropsSchema = updateActivitySchema
	.safeExtend({ difficulty: difficultySchema.optional() })
	.optional();

export const updateQuizPropsSchema = updateActivitySchema
	.safeExtend({})
	.optional();

export const updateQuestionSchema = z
	.object({
		content: questionContentSchema.optional(),
		correctAnswer: questionCorrectAnswerSchema.optional(),
	})
	.optional();
