import { z } from 'zod';
import { descriptionSchema, lessonIdSchema, nameSchema } from './fields.schema';

export const updateActivitySchema = z.object({
	name: nameSchema.optional(),
	description: descriptionSchema.optional().nullable(),
	lessonId: lessonIdSchema.optional(),
});
