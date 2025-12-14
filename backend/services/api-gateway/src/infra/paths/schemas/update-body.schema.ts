import z from 'zod'
import { descriptionSchema, nameSchema } from './fields.schema'

export const updatePathBodySchema = z
	.object({
		name: nameSchema.optional(),
		description: descriptionSchema.optional(),
	})
	.strict()
