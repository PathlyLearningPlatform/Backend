import z from 'zod';
import { limitSchema, pageSchema, userIdSchema } from './fields';
import { lessonIdSchema } from '@/infra/lesson-progress/schemas/fields';

export const listActivityProgressSchema = z
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
				lessonId: lessonIdSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict()
	.optional();
