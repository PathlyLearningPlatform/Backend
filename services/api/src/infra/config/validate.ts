import { appConfigSchema } from './schema';
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
			port: config.PORT,
			jwtAudience: config.JWT_AUDIENCE,
			jwtIssuer: config.JWT_ISSUER,
			jwtPublicKeyPath: config.JWT_PUBLIC_KEY_PATH,
		},
		db: {
			host: config.DB_HOST,
			name: config.DB_NAME,
			port: config.DB_PORT,
			user: config.DB_USER,
			password: config.DB_PASSWORD,
		},
		graphDb: {
			host: config.GRAPH_DB_HOST,
			name: config.GRAPH_DB_NAME,
			port: config.GRAPH_DB_PORT,
			user: config.GRAPH_DB_USER,
			password: config.GRAPH_DB_PASSWORD,
		},
		github: {
			projectsOrgId: config.GH_PROJECTS_ORG_ID,
			exercisesOrgId: config.GH_EXERCISES_ORG_ID,
			exercisesClassroomId: config.GH_EXERCISES_CLASSROOM_ID,
			projectsClassroomId: config.GH_PROJECTS_CLASSROOM_ID,
		},
	};

	const result = appConfigSchema.safeParse(transformedConfig);

	if (result.success) {
		return result.data;
	}

	throw new ConfigException(result.error.message, result.error);
}
