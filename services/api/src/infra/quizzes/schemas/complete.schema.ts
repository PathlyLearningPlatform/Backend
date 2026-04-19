import z from 'zod';

export const completeQuizSchema = z.object({
	quizId: z.uuid(),
	answers: z.array(
		z.object({
			questionId: z.uuid(),
			text: z.string(),
		}),
	),
});
