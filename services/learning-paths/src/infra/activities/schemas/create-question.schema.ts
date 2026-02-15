import z from 'zod';
import {
	idSchema,
	questionContentSchema,
	questionCorrectAnswerSchema,
} from './fields.schema';

export const createQuestionSchema = z
	.object({
		quizId: idSchema,
		content: questionContentSchema,
		correctAnswer: questionCorrectAnswerSchema,
	})
	.strict();
