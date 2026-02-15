import z from 'zod';
import {
	idSchema,
	questionContentSchema,
	questionCorrectAnswerSchema,
	questionIdSchema,
} from './fields.schema';

export const updateQuestionSchema = z
	.object({
		where: z
			.object({
				quizId: idSchema,
				id: questionIdSchema,
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
