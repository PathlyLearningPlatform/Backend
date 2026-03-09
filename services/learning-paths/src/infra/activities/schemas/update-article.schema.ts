import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import { descriptionSchema, nameSchema, refSchema } from './fields.schema';

export const updateArticleSchema = z
	.object({
		where: z
			.object({
				activityId: z.uuid(),
			})
			.strict(),
		fields: z
			.object({
				name: nameSchema.optional(),
				description: z.preprocess(
					emptyStringToNull,
					descriptionSchema.optional(),
				),
				ref: refSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
