import z from 'zod'
import { descriptionSchema, nameSchema, orderSchema } from './fields.schema'
import { UpdateSectionBodyDto } from '../dtos'

export const updateSectionBodySchema = z
	.object({
		name: nameSchema.optional(),
		description: descriptionSchema.optional(),
		order: orderSchema.optional(),
	})
	.strict() satisfies z.ZodType<UpdateSectionBodyDto>
