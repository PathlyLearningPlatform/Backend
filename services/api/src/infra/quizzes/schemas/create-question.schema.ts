import { z } from 'zod';
import {
	questionContentSchema,
	questionCorrectAnswerSchema,
} from './fields.schema';

export const createQuestionSchema = z
	.object({
		content: questionContentSchema,
		correctAnswer: questionCorrectAnswerSchema,
	})
	.strict();
