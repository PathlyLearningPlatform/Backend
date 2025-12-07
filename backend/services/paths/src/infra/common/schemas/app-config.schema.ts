import { z } from 'zod';

export const appConfigSchema = z
	.object({
		app: z
			.object({
				port: z.int32().default(3000),
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
