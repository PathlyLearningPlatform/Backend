import { z } from 'zod';
import { lessonIdSchema, limitSchema, pageSchema } from './fields.schema';

export const listActivitiesQuerySchema = z
	.object({
		limit: limitSchema.optional(),
		page: pageSchema.optional(),
		lessonId: lessonIdSchema.optional(),
	})
	.optional();
