import z from 'zod';
import { activityIdSchema, userIdSchema } from './fields';

export const startActivitySchema = z
	.object({
		userId: userIdSchema,
		activityId: activityIdSchema,
	})
	.strict();
