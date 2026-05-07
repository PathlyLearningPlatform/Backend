import z from 'zod';

export const listArticlesSchema = z
	.object({
		limit: z.int().nonnegative().optional(),
		page: z.int().nonnegative().optional(),
	})
	.optional();
