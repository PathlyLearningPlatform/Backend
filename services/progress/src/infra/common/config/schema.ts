import { z } from 'zod';

/**
 * @description This object is a validation schema for environment configuration.
 */
export const appConfigSchema = z
	.object({
		app: z
			.object({
				port: z.int32().default(3000),
				hostname: z.hostname(),
				protoDir: z.string(),
				learningPathsServiceUrl: z.url(),
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
	})
	.strict();
