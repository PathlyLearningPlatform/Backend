import z from 'zod';
import { idSchema, questionIdSchema } from './fields.schema';

export const removeQuestionSchema = z
	.object({
		where: z
			.object({
				quizId: idSchema,
				id: questionIdSchema,
			})
			.strict(),
	})
	.strict();
