import { z } from 'zod';

/**
 * @description This object is a validation schema for environment configuration.
 */
export const appConfigSchema = z
	.object({
		port: z.coerce.number().int(),
		hostname: z.hostname(),
		protoDir: z.string(),
		dbHost: z.hostname(),
		dbName: z.string(),
		dbPassword: z.string(),
		dbPort: z.coerce.number().int(),
		dbUser: z.string(),
	})
	.strict();
