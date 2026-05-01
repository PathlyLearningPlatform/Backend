import z from 'zod';

const senderSchema = z.object({
	login: z.string(),
	id: z.int(),
	type: z.string(),
});
const memberSchema = z.object({
	login: z.string(),
	id: z.int(),
	type: z.string(),
});
const repositorySchema = z.object({
	id: z.int(),
	name: z.string(),
	full_name: z.string(),
	html_url: z.url(),
	owner: z.object({
		login: z.string(),
		id: z.int(),
	}),
});
const organizationSchema = z.object({
	login: z.string(),
	id: z.int(),
});
const checkRunSchema = z.object({
	id: z.int(),
	status: z.enum(['completed']),
	conclusion: z.enum([
		'success',
		'failure',
		'neutral',
		'cancelled',
		'skipped',
		'timed_out',
		'action_required',
	]),
	head_sha: z.string(),
});

export const githubWebhookSchema = z.discriminatedUnion('action', [
	z.object({
		action: z.literal('member.added'),
		member: memberSchema.nullable(),
		organization: organizationSchema,
		repository: repositorySchema,
	}),
	z.object({
		action: z.literal('repository.created'),
		organization: organizationSchema,
		repository: repositorySchema,
	}),
	z.object({
		action: z.literal('repository.deleted'),
		organization: organizationSchema,
		repository: repositorySchema,
	}),
	z.object({
		action: z.literal('check_run.completed'),
		check_run: checkRunSchema,
		organization: organizationSchema,
		repository: repositorySchema,
	}),
	z.object({
		action: z.literal('push'),
		after: z.string(),
		before: z.string(),
		head_commit: z
			.object({
				id: z.string(),
			})
			.nullable(),
		ref: z.string(),
		deleted: z.boolean(),
		pusher: z.object({
			name: z.string(),
		}),
		repository: repositorySchema,
		organization: organizationSchema,
		sender: senderSchema,
	}),
]);
