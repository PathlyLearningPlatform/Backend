import { appConfigSchema } from '@infra/common/schemas'
import { ConfigException, parseIntOrReturn } from '@pathly-backend/common'

export function validateConfig(config: Record<string, unknown>) {
	const transformedConfig = {
		app: {
			port: parseIntOrReturn(config.PORT),
			hostname: config.HOSTNAME,
			learningPathsServiceUrl: config.LEARNING_PATHS_SERVICE_URL,
			protoDir: config.PROTO_DIR,
		},
	}

	const result = appConfigSchema.safeParse(transformedConfig)

	if (result.success) {
		return result.data
	}

	throw new ConfigException(result.error.message, result.error)
}
