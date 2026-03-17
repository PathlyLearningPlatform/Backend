import z from 'zod';
import { unitIdSchema, userIdSchema } from './fields';

export const startUnitSchema = z
	.object({
		userId: userIdSchema,
		unitId: unitIdSchema,
	})
	.strict();
