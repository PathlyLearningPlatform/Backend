import { emptyStringToNull } from '@pathly-backend/common'
import { z } from 'zod'
import {
	descriptionSchema,
	difficultySchema,
	lessonIdSchema,
	nameSchema,
	orderSchema,
	questionContentSchema,
	questionCorrectAnswerSchema,
	refSchema,
} from './fields.schema'

export const createActivitySchema = z.object({
	name: nameSchema,
	description: z.preprocess(
		emptyStringToNull,
		descriptionSchema.optional().nullable(),
	),
	order: orderSchema,
	lessonId: lessonIdSchema,
})

export const createArticleSchema = createActivitySchema
	.safeExtend({
		ref: refSchema,
	})
	.strict()

export const createExerciseSchema = createActivitySchema
	.safeExtend({
		difficulty: difficultySchema,
	})
	.strict()

export const createQuizSchema = createActivitySchema.safeExtend({}).strict()

export const createQuestionSchema = z
	.object({
		content: questionContentSchema,
		correctAnswer: questionCorrectAnswerSchema,
	})
	.strict()
