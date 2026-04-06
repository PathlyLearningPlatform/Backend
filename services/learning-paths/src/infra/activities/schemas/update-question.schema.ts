import { z } from "zod";
import { contentSchema, correctAnswerSchema } from "./fields.schema";

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
				content: contentSchema.optional(),
				correctAnswer: correctAnswerSchema.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
