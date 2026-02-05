import z from 'zod'
import { UnitsApiConstraints } from '@/units/enums'

export const nameSchema = z.string().max(UnitsApiConstraints.MAX_NAME_LENGTH)
export const descriptionSchema = z
	.string()
	.max(UnitsApiConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable()
export const orderSchema = z.coerce.number().nonnegative()
export const sectionIdSchema = z.uuid()
