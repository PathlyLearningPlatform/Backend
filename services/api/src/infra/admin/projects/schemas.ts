import z from 'zod';

export const createProjectSchema = z.object({
	acceptUrl: z.url(),
	name: z.string(),
	description: z.string().optional(),
	repositoryId: z.int64(),
});

export const updateProjectSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().nullable().optional(),
	})
	.optional();
