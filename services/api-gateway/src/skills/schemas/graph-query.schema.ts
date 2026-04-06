import z from 'zod'
import { idSchema } from './fields.schema'

export const getPrerequisiteGraphQuerySchema = z.object({
	parentSkillId: idSchema.optional(),
})
