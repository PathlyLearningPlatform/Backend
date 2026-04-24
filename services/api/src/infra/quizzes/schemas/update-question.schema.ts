import { z } from 'zod';
import {
	questionContentSchema,
	questionCorrectAnswerSchema,
} from './fields.schema';

export const updateQuestionSchema = z
	.object({
		content: questionContentSchema.optional(),
		correctAnswer: questionCorrectAnswerSchema.optional(),
	})
	.optional();
