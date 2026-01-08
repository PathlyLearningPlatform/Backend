import { z } from 'zod';

export const findOneLessonSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
			})
			.strict(),
	})
	.strict();
