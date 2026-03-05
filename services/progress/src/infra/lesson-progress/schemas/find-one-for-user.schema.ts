import z from 'zod';
import { lessonIdSchema, userIdSchema } from './fields';

export const findOneLessonForUserProgressSchema = z
	.object({
		userId: userIdSchema,
		lessonId: lessonIdSchema,
	})
	.strict();
