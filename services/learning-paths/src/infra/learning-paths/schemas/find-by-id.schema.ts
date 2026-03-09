import { z } from 'zod';

export const findLearningPathByIdSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
			})
			.strict(),
	})
	.strict();
