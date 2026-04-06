import { z } from 'zod';

export const removeActivityProgressSchema = z
	.object({
		activityId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
