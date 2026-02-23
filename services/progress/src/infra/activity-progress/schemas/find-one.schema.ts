import z from 'zod';
import { activityIdSchema, userIdSchema } from './fields';

export const findOneActivityProgressSchema = z
	.object({
		userId: userIdSchema,
		activityId: activityIdSchema,
	})
	.strict();
