import z from 'zod';
import { learningPathIdSchema, userIdSchema } from './fields';

export const findLearningPathProgressForUserSchema = z
	.object({
		userId: userIdSchema,
		learningPathId: learningPathIdSchema,
	})
	.strict();
