import { z } from 'zod';
import {
	questionContentSchema,
	questionCorrectAnswerSchema,
} from './fields.schema';

export const createQuestionSchema = z
	.object({
		quizId: z.uuid(),
		content: questionContentSchema,
		correctAnswer: questionCorrectAnswerSchema,
	})
	.strict();
