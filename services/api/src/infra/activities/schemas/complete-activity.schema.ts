import { z } from 'zod';

export const completeActivitySchema = z
	.object({
		activityId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
