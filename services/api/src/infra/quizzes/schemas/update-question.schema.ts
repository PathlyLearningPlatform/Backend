import { z } from 'zod';
import {
	questionContentSchema,
	questionCorrectAnswerSchema,
} from '@infra/activities/schemas/fields.schema';

export const updateQuestionSchema = z
	.object({
		content: questionContentSchema.optional(),
		correctAnswer: questionCorrectAnswerSchema.optional(),
	})
	.optional();
