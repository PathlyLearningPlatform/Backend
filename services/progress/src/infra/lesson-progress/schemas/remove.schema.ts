import z from 'zod';
import { lessonProgressIdSchema } from './fields';

export const removeLessonProgressSchema = z
	.object({
		id: lessonProgressIdSchema,
	})
	.strict();
