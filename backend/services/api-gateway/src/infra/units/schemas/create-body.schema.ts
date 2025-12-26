import z from 'zod'
import type { CreateUnitBodyDto } from '../dtos'
import {
	descriptionSchema,
	nameSchema,
	orderSchema,
	sectionIdSchema,
} from './fields.schema'

export const createUnitBodySchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.optional(),
		order: orderSchema,
		sectionId: sectionIdSchema,
	})
	.strict() satisfies z.ZodType<CreateUnitBodyDto>
