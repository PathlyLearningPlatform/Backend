import { appConfigSchema } from './schema';
import { ConfigException } from '../exceptions';

/**
 *
 * @param config - environment variables
 * @returns - parsed environment variables
 * @throws ConfigException if validation failed
 */
export function validateConfig(config: Record<string, unknown>) {
	const transformedConfig = {
		port: config.PORT,
		hostname: config.HOSTNAME,
		protoDir: config.PROTO_DIR,
		dbHost: config.DB_HOST,
		dbName: config.DB_NAME,
		dbPassword: config.DB_PASSWORD,
		dbUser: config.DB_USER,
		dbPort: config.DB_PORT,
	};

	const result = appConfigSchema.safeParse(transformedConfig);

	if (result.success) {
		return result.data;
	}

	throw new ConfigException(result.error.message, result.error);
}
