import z from 'zod';
import { limitSchema, pageSchema, userIdSchema } from './fields';
import { unitIdSchema } from '@/infra/unit-progress/schemas';

export const listLessonProgressSchema = z
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
				unitId: unitIdSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict()
	.optional();
