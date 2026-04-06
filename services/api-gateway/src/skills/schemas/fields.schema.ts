import z from 'zod'
import { SkillsApiConstraints } from '@/skills/enums'

export const idSchema = z.uuid()
export const nameSchema = z
	.string()
	.trim()
	.min(SkillsApiConstraints.MIN_NAME_LENGTH)
export const slugSchema = z
	.string()
	.trim()
	.min(SkillsApiConstraints.MIN_SLUG_LENGTH)
