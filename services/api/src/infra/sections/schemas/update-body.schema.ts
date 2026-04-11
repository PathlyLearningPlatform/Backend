import z from 'zod'
import type { UpdateSectionBodyDto } from '../dtos'
import { descriptionSchema, nameSchema } from './fields.schema'

export const updateSectionBodySchema = z.object({
	name: nameSchema.optional(),
	description: descriptionSchema.optional(),
}) satisfies z.ZodType<UpdateSectionBodyDto>
