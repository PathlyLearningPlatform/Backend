import z from 'zod'
import type { UpdateLessonBodyDto } from '../dtos'
import { descriptionSchema, nameSchema } from './fields.schema'

export const updateLessonBodySchema = z.object({
	name: nameSchema.optional(),
	description: descriptionSchema.optional(),
}) satisfies z.ZodType<UpdateLessonBodyDto>
