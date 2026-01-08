import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import {
	descriptionSchema,
	nameSchema,
	orderSchema,
	unitIdSchema,
} from './fields.schema';

export const createLessonSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		order: orderSchema,
		unitId: unitIdSchema,
	})
	.strict();
