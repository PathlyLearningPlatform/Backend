import z from 'zod';
import { unitIdSchema, userIdSchema } from './fields';

export const findUnitProgressForUserSchema = z
	.object({
		userId: userIdSchema,
		unitId: unitIdSchema,
	})
	.strict();
