import { z } from 'zod'

export const appConfigSchema = z
	.object({
		app: z
			.object({
				port: z.int32().default(3000),
				protoDir: z.string(),
				hostname: z.hostname(),
				learningPathsServiceUrl: z.url(),
			})
			.strict(),
	})
	.strict()
