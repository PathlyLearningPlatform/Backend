import { emptyStringToNull } from '@infra/common';
import { z } from 'zod';
import { descriptionSchema, nameSchema } from './fields.schema';

export const updateSectionSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
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
