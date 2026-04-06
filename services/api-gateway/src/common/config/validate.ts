import { ConfigException, parseIntOrReturn } from '@pathly-backend/common'
import { appConfigSchema } from './app-config.schema'

export function validateConfig(config: Record<string, unknown>) {
	const transformedConfig = {
		app: {
			port: parseIntOrReturn(config.PORT),
			hostname: config.HOSTNAME,
			learningPathsServiceUrl: config.LEARNING_PATHS_SERVICE_URL,
			progressServiceUrl: config.PROGRESS_SERVICE_URL,
			protoDir: config.PROTO_DIR,
			jwtAudience: config.JWT_AUDIENCE,
			jwtIssuer: config.JWT_ISSUER,
			jwtPublicKeyPath: config.JWT_PUBLIC_KEY_PATH,
			skillsServiceUrl: config.SKILLS_SERVICE_URL,
		},
	}

	const result = appConfigSchema.safeParse(transformedConfig)

	if (result.success) {
		return result.data
	}

	throw new ConfigException(result.error.message, result.error)
}
