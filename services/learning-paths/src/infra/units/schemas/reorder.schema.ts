import { z } from 'zod';

export const reorderUnitSchema = z
	.object({
		unitId: z.uuid(),
		order: z.int32().nonnegative(),
	})
	.strict();
