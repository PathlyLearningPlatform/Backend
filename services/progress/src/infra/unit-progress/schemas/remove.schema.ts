import z from 'zod';
import { unitProgressIdSchema } from './fields';

export const removeUnitProgressSchema = z
	.object({
		id: unitProgressIdSchema,
	})
	.strict();
