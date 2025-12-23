import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import { descriptionSchema, nameSchema, orderSchema } from './fields.schema';

export const updateUnitSchema = z
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
				order: orderSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
