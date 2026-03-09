import z from 'zod'
import { SectionsApiConstraints } from '@/sections/enums'

export const nameSchema = z.string().max(SectionsApiConstraints.MAX_NAME_LENGTH)
export const descriptionSchema = z
	.string()
	.max(SectionsApiConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable()
export const learningPathIdSchema = z.uuid()
