import { z } from 'zod';

export const removeUnitProgressSchema = z
	.object({
		unitId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
