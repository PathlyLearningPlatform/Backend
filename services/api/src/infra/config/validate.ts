import { appConfigSchema } from './schema';
import { parseIntOrReturn } from '@infra/common';
import { ConfigException } from '@infra/common';

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
			jwtAudience: config.JWT_AUDIENCE,
			jwtIssuer: config.JWT_ISSUER,
			jwtPublicKeyPath: config.JWT_PUBLIC_KEY_PATH,
		},
		db: {
			host: config.DB_HOST,
			name: config.DB_NAME,
			port: parseIntOrReturn(config.DB_PORT),
			user: config.DB_USER,
			password: config.DB_PASSWORD,
		},
		graphDb: {
			host: config.GRAPH_DB_HOST,
			name: config.GRAPH_DB_NAME,
			port: parseIntOrReturn(config.GRAPH_DB_PORT),
			user: config.GRAPH_DB_USER,
			password: config.GRAPH_DB_PASSWORD,
		},
	};

	const result = appConfigSchema.safeParse(transformedConfig);

	if (result.success) {
		return result.data;
	}

	throw new ConfigException(result.error.message, result.error);
}
