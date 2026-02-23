import z from 'zod';
import { activityIdSchema, userIdSchema } from './fields';

export const completeActivitySchema = z
	.object({
		userId: userIdSchema,
		activityId: activityIdSchema,
	})
	.strict();
