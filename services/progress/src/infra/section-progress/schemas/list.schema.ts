import z from 'zod';
import {
	learningPathIdSchema,
	limitSchema,
	pageSchema,
	userIdSchema,
} from './fields';

export const listSectionProgressSchema = z
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
				learningPathId: learningPathIdSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict()
	.optional();
