import z from 'zod'
import { idSchema, nameSchema } from './fields.schema'

export const createSkillBodySchema = z.object({
	name: nameSchema,
	parentId: idSchema.nullable().optional(),
})
