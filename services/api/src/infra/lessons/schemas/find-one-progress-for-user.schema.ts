import { z } from 'zod';

export const findLessonProgressForUserSchema = z
	.object({
		lessonId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
