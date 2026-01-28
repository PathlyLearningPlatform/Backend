import { emptyStringToNull } from '@pathly-backend/common';
import { z } from 'zod';
import { clientExerciseDifficultyToDomain } from '../helpers';
import {
	descriptionSchema,
	difficultySchema,
	idSchema,
	lessonIdSchema,
	nameSchema,
	orderSchema,
	refSchema,
} from './fields.schema';

export const updateArticleSchema = z
	.object({
		where: z.object({
			activityId: idSchema,
		}),
		fields: z.object({
			name: nameSchema.optional(),
			description: z.preprocess(
				emptyStringToNull,
				descriptionSchema.optional().nullable(),
			),
			order: orderSchema.optional(),
			lessonId: lessonIdSchema.optional(),
			ref: refSchema.optional(),
		}),
	})
	.strict();

export const updateExerciseSchema = z
	.object({
		where: z.object({
			activityId: idSchema,
		}),
		fields: z.object({
			name: nameSchema.optional(),
			description: z.preprocess(
				emptyStringToNull,
				descriptionSchema.optional().nullable(),
			),
			order: orderSchema.optional(),
			lessonId: lessonIdSchema.optional(),
			difficulty: difficultySchema
				.optional()
				.transform(clientExerciseDifficultyToDomain),
		}),
	})
	.strict();

export const updateQuizSchema = z
	.object({
		where: z.object({
			activityId: idSchema,
		}),
		fields: z.object({
			name: nameSchema.optional(),
			description: z.preprocess(
				emptyStringToNull,
				descriptionSchema.optional().nullable(),
			),
			order: orderSchema.optional(),
			lessonId: lessonIdSchema.optional(),
		}),
	})
	.strict();
