import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import { descriptionSchema, nameSchema, lessonIdSchema } from './fields.schema';

export const createQuizSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		lessonId: lessonIdSchema,
	})
	.strict();
