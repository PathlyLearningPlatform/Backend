import z from 'zod'
import { descriptionSchema, nameSchema } from './fields.schema'

export const updateLearningPathBodySchema = z
	.object({
		name: nameSchema.optional(),
		description: descriptionSchema.optional(),
	})
	.strict()
