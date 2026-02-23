import z from 'zod';
import { idSchema } from './fields';

export const findActivityProgressByIdSchema = z
	.object({
		id: idSchema,
	})
	.strict();
