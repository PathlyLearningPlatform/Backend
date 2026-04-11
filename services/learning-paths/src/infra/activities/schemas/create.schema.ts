import { emptyStringToNull } from '@infra/common';
import { z } from 'zod';
import {
	descriptionSchema,
	difficultySchema,
	lessonIdSchema,
	nameSchema,
	questionContentSchema,
	questionCorrectAnswerSchema,
	refSchema,
} from './fields.schema';

export const createActivitySchema = z.object({
	name: nameSchema,
	description: z.preprocess(
		emptyStringToNull,
		descriptionSchema.optional().nullable(),
	),
	lessonId: lessonIdSchema,
});

export const createArticleSchema = createActivitySchema.safeExtend({
	ref: refSchema,
});

export const createExerciseSchema = createActivitySchema.safeExtend({
	difficulty: difficultySchema,
});

export const createQuizSchema = createActivitySchema.safeExtend({});

export const createQuestionSchema = z.object({
	content: questionContentSchema,
	correctAnswer: questionCorrectAnswerSchema,
});
