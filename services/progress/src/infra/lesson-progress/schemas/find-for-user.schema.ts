import z from 'zod';
import { lessonIdSchema, userIdSchema } from './fields';

export const findLessonProgressForUserSchema = z
	.object({
		userId: userIdSchema,
		lessonId: lessonIdSchema,
	})
	.strict();
