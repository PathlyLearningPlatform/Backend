import z from 'zod'
import type { UpdateLessonBodyDto } from '../dtos'
import { descriptionSchema, nameSchema, orderSchema } from './fields.schema'

export const updateLessonBodySchema = z
	.object({
		name: nameSchema.optional(),
		description: descriptionSchema.optional(),
		order: orderSchema.optional(),
	})
	.strict() satisfies z.ZodType<UpdateLessonBodyDto>
