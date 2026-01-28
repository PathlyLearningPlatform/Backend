import { z } from 'zod';
import { idSchema } from './fields.schema';

export const findOneActivitySchema = z
	.object({
		where: z.object({
			id: idSchema,
		}),
	})
	.strict();
