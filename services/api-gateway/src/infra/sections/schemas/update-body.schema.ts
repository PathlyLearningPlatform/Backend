import z from 'zod'
import type { UpdateSectionBodyDto } from '../dtos'
import { descriptionSchema, nameSchema, orderSchema } from './fields.schema'

export const updateSectionBodySchema = z
	.object({
		name: nameSchema.optional(),
		description: descriptionSchema.optional(),
		order: orderSchema.optional(),
	})
	.strict() satisfies z.ZodType<UpdateSectionBodyDto>
