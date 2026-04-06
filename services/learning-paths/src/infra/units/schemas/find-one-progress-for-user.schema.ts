import { z } from 'zod';

export const findUnitProgressForUserSchema = z
	.object({
		unitId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
