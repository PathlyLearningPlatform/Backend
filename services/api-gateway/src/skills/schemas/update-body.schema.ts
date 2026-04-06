import z from 'zod'
import { nameSchema } from './fields.schema'

export const updateSkillBodySchema = z.object({
	name: nameSchema.optional(),
})
