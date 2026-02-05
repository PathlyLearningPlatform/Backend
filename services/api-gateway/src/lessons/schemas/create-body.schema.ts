import z from 'zod'
import type { CreateLessonBodyDto } from '../dtos'
import {
	descriptionSchema,
	nameSchema,
	orderSchema,
	unitIdSchema,
} from './fields.schema'

export const createLessonBodySchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.optional(),
		order: orderSchema,
		unitId: unitIdSchema,
	})
	.strict() satisfies z.ZodType<CreateLessonBodyDto>
