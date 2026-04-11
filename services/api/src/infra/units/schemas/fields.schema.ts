import z from 'zod'
import { UnitsApiConstraints } from '@infra/units/enums'

export const nameSchema = z.string().max(UnitsApiConstraints.MAX_NAME_LENGTH)
export const descriptionSchema = z
	.string()
	.max(UnitsApiConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable()
export const sectionIdSchema = z.uuid()
