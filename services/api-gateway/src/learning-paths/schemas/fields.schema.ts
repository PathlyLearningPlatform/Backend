import z from 'zod'
import { LearningPathsApiConstraints } from '@/learning-paths/enums'

export const nameSchema = z
	.string()
	.max(LearningPathsApiConstraints.MAX_NAME_LENGTH)
export const descriptionSchema = z
	.string()
	.max(LearningPathsApiConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable()
