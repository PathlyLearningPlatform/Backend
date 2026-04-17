import { z } from 'zod';
import {
	questionContentSchema,
	questionCorrectAnswerSchema,
} from '@infra/activities/schemas/fields.schema';

export const createQuestionSchema = z
	.object({
		content: questionContentSchema,
		correctAnswer: questionCorrectAnswerSchema,
	})
	.strict();
