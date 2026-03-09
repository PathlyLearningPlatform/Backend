import { z } from 'zod';

export const reorderQuestionSchema = z
	.object({
		questionId: z.uuid(),
		order: z.int32().nonnegative(),
		quizId: z.uuid(),
	})
	.strict();
