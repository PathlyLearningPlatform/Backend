import z from 'zod';
import { learningPathIdSchema, userIdSchema } from './fields';

export const startLearningPathSchema = z
	.object({
		userId: userIdSchema,
		learningPathId: learningPathIdSchema,
	})
	.strict();
