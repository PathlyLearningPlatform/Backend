import z from 'zod'
import type { CreateSectionBodyDto } from '../dtos'
import {
	descriptionSchema,
	learningPathIdSchema,
	nameSchema,
} from './fields.schema'

export const createSectionBodySchema = z.object({
	name: nameSchema,
	description: descriptionSchema.optional(),
	learningPathId: learningPathIdSchema,
}) satisfies z.ZodType<CreateSectionBodyDto>
