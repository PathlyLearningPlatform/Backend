import z from 'zod'
import { descriptionSchema, nameSchema } from './fields.schema'

export const createPathBodySchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.optional(),
	})
	.strict()
