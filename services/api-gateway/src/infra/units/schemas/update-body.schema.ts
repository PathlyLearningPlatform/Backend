import z from 'zod'
import type { UpdateUnitBodyDto } from '../dtos'
import { descriptionSchema, nameSchema, orderSchema } from './fields.schema'

export const updateUnitBodySchema = z
	.object({
		name: nameSchema.optional(),
		description: descriptionSchema.optional(),
		order: orderSchema.optional(),
	})
	.strict() satisfies z.ZodType<UpdateUnitBodyDto>
