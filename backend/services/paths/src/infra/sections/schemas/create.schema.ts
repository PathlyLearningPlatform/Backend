import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import {
	descriptionSchema,
	nameSchema,
	orderSchema,
	pathIdSchema,
} from './fields.schema';

export const createSectionSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		order: orderSchema,
		pathId: pathIdSchema,
	})
	.strict();
