import z from 'zod'
import { slugSchema } from './fields.schema'

export const findSkillBySlugQuerySchema = z.object({
	slug: slugSchema,
})
