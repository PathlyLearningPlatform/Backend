import { z } from 'zod';

export const removeLearningPathProgressSchema = z
	.object({
		learningPathId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
