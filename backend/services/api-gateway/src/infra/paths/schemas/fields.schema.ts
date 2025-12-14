import { PathConstraints } from '@/domain/paths/enums'
import z from 'zod'

export const nameSchema = z.string().max(PathConstraints.MAX_NAME_LENGTH)
export const descriptionSchema = z
	.string()
	.max(PathConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable()
