import z from 'zod'
import { LessonConstraints } from '@/domain/lessons/enums'

export const nameSchema = z.string().max(LessonConstraints.MAX_NAME_LENGTH)
export const descriptionSchema = z
	.string()
	.max(LessonConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable()
export const orderSchema = z.coerce.number().nonnegative()
export const unitIdSchema = z.uuid()
