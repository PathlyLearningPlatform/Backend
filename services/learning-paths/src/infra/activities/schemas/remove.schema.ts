import { z } from 'zod';
import { idSchema } from './fields.schema';

export const removeActivitySchema = z
	.object({
		where: z.object({
			id: idSchema,
		}),
	})
	.strict();
