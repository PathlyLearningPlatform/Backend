import { appConfigSchema } from '@infra/common/schemas';
import { ConfigException, parseIntOrReturn } from '@pathly-backend/common';

/**
 *
 * @param config - environment variables
 * @returns - parsed environment variables
 * @throws ConfigException if validation failed
 */
export function validateConfig(config: Record<string, unknown>) {
	const transformedConfig = {
		app: {
			port: parseIntOrReturn(config.PORT),
			hostname: config.HOSTNAME,
			protoDir: config.PROTO_DIR,
			learningPathsServiceUrl: config.LEARNING_PATHS_SERVICE_URL,
		},
		db: {
			host: config.DB_HOST,
			name: config.DB_NAME,
			port: parseIntOrReturn(config.DB_PORT),
			user: config.DB_USER,
			password: config.DB_PASSWORD,
		},
	};

	const result = appConfigSchema.safeParse(transformedConfig);

	if (result.success) {
		return result.data;
	}

	throw new ConfigException(result.error.message, result.error);
}
