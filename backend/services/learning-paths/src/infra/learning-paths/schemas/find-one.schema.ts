import { z } from 'zod';

export const findOneLearningPathSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
			})
			.strict(),
	})
	.strict();
