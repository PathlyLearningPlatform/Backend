import z from 'zod';
import { activityIdSchema, userIdSchema } from './fields';

export const findActivityProgressForUserSchema = z
	.object({
		userId: userIdSchema,
		activityId: activityIdSchema,
	})
	.strict();
