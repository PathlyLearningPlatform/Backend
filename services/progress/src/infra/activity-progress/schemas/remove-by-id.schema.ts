import z from 'zod';
import { idSchema } from './fields';

export const removeActivityProgressByIdSchema = z
	.object({
		id: idSchema,
	})
	.strict();
