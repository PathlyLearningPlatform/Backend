import { emptyStringToNull } from '@pathly-backend/common'
import { z } from 'zod'
import {
	descriptionSchema,
	difficultySchema,
	lessonIdSchema,
	nameSchema,
	orderSchema,
	refSchema,
} from './fields.schema'

export const updateActivitySchema = z.object({
	name: nameSchema.optional(),
	description: z.preprocess(
		emptyStringToNull,
		descriptionSchema.optional().nullable(),
	),
	order: orderSchema.optional(),
	lessonId: lessonIdSchema.optional(),
})

export const updateArticlePropsSchema = updateActivitySchema
	.safeExtend({
		ref: refSchema.optional(),
	})
	.strict()
	.optional()

export const updateExercisePropsSchema = updateActivitySchema
	.safeExtend({ difficulty: difficultySchema.optional() })
	.strict()
	.optional()

export const updateQuizPropsSchema = updateActivitySchema
	.safeExtend({})
	.strict()
	.optional()
