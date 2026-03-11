import { emptyStringToNull } from '@pathly-backend/common'
import { z } from 'zod'
import {
	descriptionSchema,
	difficultySchema,
	lessonIdSchema,
	nameSchema,
	questionContentSchema,
	questionCorrectAnswerSchema,
	refSchema,
} from './fields.schema'

export const updateActivitySchema = z.object({
	name: nameSchema.optional(),
	description: z.preprocess(
		emptyStringToNull,
		descriptionSchema.optional().nullable(),
	),
	lessonId: lessonIdSchema.optional(),
})

export const updateArticlePropsSchema = updateActivitySchema
	.safeExtend({
		ref: refSchema.optional(),
	})
	.optional()

export const updateExercisePropsSchema = updateActivitySchema
	.safeExtend({ difficulty: difficultySchema.optional() })
	.optional()

export const updateQuizPropsSchema = updateActivitySchema
	.safeExtend({})
	.optional()

export const updateQuestionSchema = z
	.object({
		content: questionContentSchema.optional(),
		correctAnswer: questionCorrectAnswerSchema.optional(),
	})
	.optional()
