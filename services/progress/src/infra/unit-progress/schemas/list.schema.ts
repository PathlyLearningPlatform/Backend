import z from 'zod';
import {
	limitSchema,
	pageSchema,
	sectionIdSchema,
	userIdSchema,
} from './fields';

export const listUnitProgressSchema = z
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
				sectionId: sectionIdSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict()
	.optional();
