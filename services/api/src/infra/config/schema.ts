import { z } from 'zod';

/**
 * @description This object is a validation schema for environment configuration.
 */
export const appConfigSchema = z
	.object({
		app: z
			.object({
				port: z.coerce.number().int().default(3000),
				jwtAudience: z.string(),
				jwtIssuer: z.string(),
				jwtPublicKeyPath: z.string(),
			})
			.strict(),
		db: z
			.object({
				host: z.string(),
				name: z.string(),
				port: z.coerce.number().int().default(5432),
				user: z.string(),
				password: z.string(),
			})
			.strict(),
		graphDb: z.object({
			host: z.hostname(),
			name: z.string(),
			password: z.string(),
			port: z.coerce.number().int(),
			user: z.string(),
		}),
		github: z.object({
			projectsOrgId: z.coerce.number().int(),
			exercisesOrgId: z.coerce.number().int(),
			exercisesClassroomId: z.coerce.number().int(),
			projectsClassroomId: z.coerce.number().int(),
			projectsClassroomPAT: z.string().optional(),
			appWebhookSecret: z.string().optional(),
		}),
		keycloak: z.object({
			realmName: z.string(),
			clientSecret: z.string(),
			clientId: z.string(),
			baseUrl: z.url(),
		}),
	})
	.strict();
