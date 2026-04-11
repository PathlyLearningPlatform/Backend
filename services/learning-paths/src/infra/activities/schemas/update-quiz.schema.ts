import { emptyStringToNull } from '@infra/common';
import { z } from 'zod';
import { descriptionSchema, nameSchema } from './fields.schema';

export const updateQuizSchema = z
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
			})
			.strict()
			.optional(),
	})
	.strict();
