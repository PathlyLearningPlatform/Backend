import { z } from 'zod';

export const startLessonSchema = z
	.object({
		lessonId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
