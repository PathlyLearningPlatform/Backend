import z from 'zod';

export const githubWebhookSchema = z.object({
	action: z.string(),
	repository: z.object({
		id: z.int(),
		name: z.string(),
		url: z.url(),
		created_at: z.iso.datetime(),
	}),
	sender: z.object({ login: z.string(), id: z.string() }),
	organization: z.object({
		login: z.string(),
		id: z.int(),
	}),
	check_run: z
		.object({
			id: z.int(),
			name: z.string(),
			status: z.string(),
			conclussion: z.string(),
			started_at: z.iso.datetime(),
			completed_at: z.iso.datetime(),
		})
		.optional(),
});
