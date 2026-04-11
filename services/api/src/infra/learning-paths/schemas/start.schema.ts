import { z } from 'zod';

export const startLearningPathSchema = z
	.object({
		learningPathId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
