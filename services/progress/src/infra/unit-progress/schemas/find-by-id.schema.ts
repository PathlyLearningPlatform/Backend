import z from 'zod';
import { unitProgressIdSchema } from './fields';

export const findUnitProgressByIdSchema = z
	.object({
		id: unitProgressIdSchema,
	})
	.strict();
