import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import { descriptionSchema, nameSchema } from './fields.schema';

export const createLearningPathSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
	})
	.strict();
