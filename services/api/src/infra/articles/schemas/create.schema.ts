import { z } from 'zod';
import {
	descriptionSchema,
	lessonIdSchema,
	nameSchema,
} from '@infra/activities/schemas/fields.schema';
import { refSchema } from './fields.schema';

export const createArticleSchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.nullable().optional().default(null),
		lessonId: lessonIdSchema,
		ref: refSchema,
	})
	.strict();
