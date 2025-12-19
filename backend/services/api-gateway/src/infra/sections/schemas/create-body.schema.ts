import z from 'zod'
import {
	descriptionSchema,
	nameSchema,
	orderSchema,
	pathIdSchema,
} from './fields.schema'
import { CreateSectionBodyDto } from '../dtos'

export const createSectionBodySchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.optional(),
		order: orderSchema,
		pathId: pathIdSchema,
	})
	.strict() satisfies z.ZodType<CreateSectionBodyDto>
