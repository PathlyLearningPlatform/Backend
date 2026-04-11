import { z } from 'zod';

export const startUnitSchema = z
	.object({
		unitId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
