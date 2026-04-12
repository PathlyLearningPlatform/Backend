import { z } from 'zod';
import {
	descriptionSchema,
	lessonIdSchema,
	nameSchema,
	refSchema,
} from './fields.schema';

export const createArticleSchema = z
	.object({
		name: nameSchema,
		description: descriptionSchema.nullable().optional().default(null),
		lessonId: lessonIdSchema,
		ref: refSchema,
	})
	.strict();
