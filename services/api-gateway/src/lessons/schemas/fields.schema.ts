import z from 'zod'
import { LessonsApiConstraints } from '@/lessons/enums'

export const nameSchema = z.string().max(LessonsApiConstraints.MAX_NAME_LENGTH)
export const descriptionSchema = z
	.string()
	.max(LessonsApiConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable()
export const orderSchema = z.coerce.number().nonnegative()
export const unitIdSchema = z.uuid()
