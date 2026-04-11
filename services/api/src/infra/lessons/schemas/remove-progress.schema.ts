import { z } from 'zod';

export const removeLessonProgressSchema = z
	.object({
		lessonId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
