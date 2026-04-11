import { z } from "zod";

export const removeQuestionSchema = z
	.object({
		where: z
			.object({
				id: z.uuid(),
				quizId: z.uuid(),
			})
			.strict(),
	})
	.strict();
