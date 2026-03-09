import { z } from 'zod';
import { contentSchema, correctAnswerSchema } from './fields.schema';

export const createQuestionSchema = z
	.object({
		quizId: z.uuid(),
		content: contentSchema,
		correctAnswer: correctAnswerSchema,
	})
	.strict();
