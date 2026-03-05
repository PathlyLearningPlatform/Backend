import z from 'zod';
import { idSchema } from './fields';

export const removeLessonProgressByIdSchema = z
	.object({
		id: idSchema,
	})
	.strict();
