import z from 'zod';

export const createArticleSchema = z
	.object({
		name: z.string(),
		description: z.string().nullable().optional().default(null),
		ref: z.url(),
	})
	.strict();

export const updateArticleSchema = z
	.object({
		ref: z.url().optional(),
		name: z.string().optional(),
		description: z.string().optional().nullable(),
	})
	.optional();
