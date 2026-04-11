import { emptyStringToNull } from '@infra/common';
import { z } from 'zod';
import { descriptionSchema, lessonIdSchema, nameSchema } from './fields.schema';

export const createQuizSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.nullable().optional().default(null),
		),
		lessonId: lessonIdSchema,
	})
	.strict();
