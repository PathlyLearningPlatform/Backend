import { z } from 'zod';
import {
	questionContentSchema,
	questionCorrectAnswerSchema,
} from './fields.schema';

export const updateQuestionSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
				quizId: z.uuid(),
			})
			.strict(),
		fields: z
			.object({
				content: questionContentSchema.optional(),
				correctAnswer: questionCorrectAnswerSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
