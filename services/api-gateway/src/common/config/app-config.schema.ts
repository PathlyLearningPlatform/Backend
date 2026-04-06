import { z } from 'zod'

export const appConfigSchema = z
	.object({
		app: z
			.object({
				port: z.int32().default(3000),
				protoDir: z.string(),
				hostname: z.hostname(),
				learningPathsServiceUrl: z.url(),
				progressServiceUrl: z.url(),
				jwtAudience: z.string(),
				jwtIssuer: z.string(),
				jwtPublicKeyPath: z.string(),
				skillsServiceUrl: z.url(),
			})
			.strict(),
	})
	.strict()
