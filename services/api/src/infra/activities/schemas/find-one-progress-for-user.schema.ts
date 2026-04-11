import { z } from 'zod';

export const findActivityProgressForUserSchema = z
	.object({
		activityId: z.uuid(),
		userId: z.uuid(),
	})
	.strict();
