import { z } from 'zod';
import { descriptionSchema, lessonIdSchema, nameSchema } from './fields.schema';

export const createActivitySchema = z.object({
	name: nameSchema,
	description: descriptionSchema.optional().nullable(),
	lessonId: lessonIdSchema,
});
