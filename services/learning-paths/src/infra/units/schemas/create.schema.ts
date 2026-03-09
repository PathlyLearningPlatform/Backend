import { emptyStringToNull } from '@pathly-backend/common/index.js';
import { z } from 'zod';
import {
	descriptionSchema,
	nameSchema,
	sectionIdSchema,
} from './fields.schema';

export const createUnitSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		sectionId: sectionIdSchema,
	})
	.strict();
