import { z } from 'zod';

/**
 * @description This object is a validation schema for environment configuration.
 */
export const appConfigSchema = z
	.object({
		app: z
			.object({
				port: z.int32().default(3000),
				jwtAudience: z.string(),
				jwtIssuer: z.string(),
				jwtPublicKeyPath: z.string(),
			})
			.strict(),
		db: z
			.object({
				host: z.string(),
				name: z.string(),
				port: z.int32().default(5432),
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
	})
	.strict();
