import z from 'zod';
import { activityProgressidSchema } from './fields';

export const removeActivityProgressSchema = z
	.object({
		id: activityProgressidSchema,
	})
	.strict();
