import z from 'zod';
import { idSchema } from './fields.schema';

export const findQuestionsSchema = z
	.object({
		quizId: idSchema,
	})
	.strict();
