import z from 'zod'
import { idSchema } from './fields.schema'

export const addChildBodySchema = z.object({
	parentSkillId: idSchema,
	childSkillId: idSchema,
})
