import z from 'zod'
import type { CreateUnitBodyDto } from '../dtos'
import { descriptionSchema, nameSchema, sectionIdSchema } from './fields.schema'

export const createUnitBodySchema = z.object({
	name: nameSchema,
	description: descriptionSchema.optional(),
	sectionId: sectionIdSchema,
}) satisfies z.ZodType<CreateUnitBodyDto>
