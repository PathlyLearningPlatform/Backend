import { emptyStringToNull } from '@pathly-backend/common';
import { z } from 'zod';
import { clientExerciseDifficultyToDomain } from '../helpers';
import {
	descriptionSchema,
	difficultySchema,
	lessonIdSchema,
	nameSchema,
	orderSchema,
	refSchema,
} from './fields.schema';

export const createArticleSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().nullable(),
		),
		order: orderSchema,
		lessonId: lessonIdSchema,
		ref: refSchema,
	})
	.strict();

export const createExerciseSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().nullable(),
		),
		order: orderSchema,
		lessonId: lessonIdSchema,
		difficulty: difficultySchema.transform(clientExerciseDifficultyToDomain),
	})
	.strict();

export const createQuizSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().nullable(),
		),
		order: orderSchema,
		lessonId: lessonIdSchema,
	})
	.strict();
