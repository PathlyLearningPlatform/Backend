import { emptyStringToNull } from '@infra/common';
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
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.nullable().optional().default(null),
		),
		lessonId: lessonIdSchema,
		ref: refSchema,
	})
	.strict();
