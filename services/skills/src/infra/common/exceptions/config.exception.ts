import { InfraException } from './infra.exception';

export class ConfigException extends InfraException {
	constructor(message: string, cause: unknown = null) {
		super(message, false, cause);
	}
}
