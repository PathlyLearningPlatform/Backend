import { z } from 'zod';
import { LearningPathConstraints } from '@/domain/learning-paths/enums';

export const descriptionSchema = z
	.string()
	.max(LearningPathConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable();
export const nameSchema = z.string().max(LearningPathConstraints.MAX_NAME_LENGTH);
