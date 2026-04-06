import z from 'zod'
import { idSchema } from './fields.schema'

export const addNextStepBodySchema = z.object({
	prerequisiteSkillId: idSchema,
	targetSkillId: idSchema,
})
