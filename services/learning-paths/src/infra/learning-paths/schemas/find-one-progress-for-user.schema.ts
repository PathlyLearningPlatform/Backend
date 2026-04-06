import { z } from 'zod';

export const findLearningPathProgressForUserSchema = z
	.object({
		learningPathId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
