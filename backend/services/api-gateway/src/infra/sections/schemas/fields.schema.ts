import z from 'zod'
import { SectionConstraints } from '@/domain/sections/enums'

export const nameSchema = z.string().max(SectionConstraints.MAX_NAME_LENGTH)
export const descriptionSchema = z
	.string()
	.max(SectionConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable()
export const orderSchema = z.coerce.number().nonnegative()
export const pathIdSchema = z.uuid()
