import { emptyStringToNull } from '@infra/common';
import { z } from 'zod';
import { descriptionSchema, nameSchema, unitIdSchema } from './fields.schema';

export const createLessonSchema = z
	.object({
		name: nameSchema,
		description: z.preprocess(
			emptyStringToNull,
			descriptionSchema.optional().default(null),
		),
		unitId: unitIdSchema,
	})
	.strict();
