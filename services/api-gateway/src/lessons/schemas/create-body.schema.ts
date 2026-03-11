import z from 'zod'
import type { CreateLessonBodyDto } from '../dtos'
import { descriptionSchema, nameSchema, unitIdSchema } from './fields.schema'

export const createLessonBodySchema = z.object({
	name: nameSchema,
	description: descriptionSchema.optional(),
	unitId: unitIdSchema,
}) satisfies z.ZodType<CreateLessonBodyDto>
