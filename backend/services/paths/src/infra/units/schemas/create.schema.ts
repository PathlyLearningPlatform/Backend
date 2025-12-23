import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import {
	descriptionSchema,
	nameSchema,
	orderSchema,
	sectionIdSchema,
} from './fields.schema';

export const createUnitSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		order: orderSchema,
		sectionId: sectionIdSchema,
	})
	.strict();
