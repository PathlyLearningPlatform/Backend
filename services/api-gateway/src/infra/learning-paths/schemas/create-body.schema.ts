import z from 'zod'
import { descriptionSchema, nameSchema } from './fields.schema'

export const createLearningPathBodySchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.optional(),
	})
	.strict()
