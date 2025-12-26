import z from 'zod'
import type { CreateSectionBodyDto } from '../dtos'
import {
	descriptionSchema,
	nameSchema,
	orderSchema,
	pathIdSchema,
} from './fields.schema'

export const createSectionBodySchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.optional(),
		order: orderSchema,
		pathId: pathIdSchema,
	})
	.strict() satisfies z.ZodType<CreateSectionBodyDto>
