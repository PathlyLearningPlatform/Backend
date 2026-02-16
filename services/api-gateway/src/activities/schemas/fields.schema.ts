import { ExerciseDifficulty } from '../enums'
import { z } from 'zod'
import { ActivitiesApiConstraints } from '../enums'

export const idSchema = z.uuid()
export const nameSchema = z
	.string()
	.min(1)
	.max(ActivitiesApiConstraints.MAX_NAME_LENGTH)
export const descriptionSchema = z
	.string()
	.max(ActivitiesApiConstraints.MAX_DESCRIPTION_LENGTH)
export const orderSchema = z.number().int().min(0)
export const lessonIdSchema = z.uuid()
export const refSchema = z.url()
export const difficultySchema = z.enum(ExerciseDifficulty)

export const limitSchema = z.coerce
	.number()
	.int()
	.min(ActivitiesApiConstraints.MIN_LIMIT)
	.max(ActivitiesApiConstraints.MAX_LIMIT)
export const pageSchema = z.coerce
	.number()
	.int()
	.min(ActivitiesApiConstraints.MIN_PAGE)

export const questionIdSchema = z.uuid()
export const questionContentSchema = z.string()
export const questionCorrectAnswerSchema = z.string()
