import { z } from 'zod';
import {
	descriptionSchema,
	lessonIdSchema,
	nameSchema,
} from '@infra/activities/schemas/fields.schema';

export const createQuizSchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.nullable().optional().default(null),
		lessonId: lessonIdSchema,
	})
	.strict();
