import z from 'zod'
import type { CreateSectionBodyDto } from '../dtos'
import {
	descriptionSchema,
	learningPathIdSchema,
	nameSchema,
	orderSchema,
} from './fields.schema'

export const createSectionBodySchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.optional(),
		order: orderSchema,
		learningPathId: learningPathIdSchema,
	})
	.strict() satisfies z.ZodType<CreateSectionBodyDto>
