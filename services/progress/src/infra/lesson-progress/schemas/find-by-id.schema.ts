import z from 'zod';
import { idSchema } from './fields';

export const findLessonProgressByIdSchema = z
	.object({
		id: idSchema,
	})
	.strict();
