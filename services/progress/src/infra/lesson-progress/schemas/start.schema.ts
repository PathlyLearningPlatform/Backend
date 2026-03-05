import z from 'zod';
import { lessonIdSchema, userIdSchema } from './fields';

export const startLessonSchema = z
	.object({
		userId: userIdSchema,
		lessonId: lessonIdSchema,
	})
	.strict();
