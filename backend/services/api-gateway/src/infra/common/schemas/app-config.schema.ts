import { z } from 'zod'

export const appConfigSchema = z
	.object({
		app: z
			.object({
				port: z.int32().default(3000),
			})
			.strict(),
	})
	.strict()
