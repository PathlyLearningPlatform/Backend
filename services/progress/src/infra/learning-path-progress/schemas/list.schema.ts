import z from 'zod';
import { limitSchema, pageSchema, userIdSchema } from './fields';

export const listLearningPathProgressSchema = z
	.object({
		options: z
			.object({
				limit: limitSchema.optional(),
				page: pageSchema.optional(),
			})
			.strict()
			.optional(),
		where: z
			.object({
				userId: userIdSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict()
	.optional();
