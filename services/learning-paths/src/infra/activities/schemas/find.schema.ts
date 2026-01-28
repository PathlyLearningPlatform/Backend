import { z } from 'zod';
import { limitSchema, pageSchema } from './fields.schema';

export const findActivitiesSchema = z
	.object({
		options: z
			.object({
				limit: limitSchema.optional(),
				page: pageSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict()
	.optional();
