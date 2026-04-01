import { InfraException } from './infra.exception';

export class DbException extends InfraException {
	constructor(message: string, cause: unknown = null) {
		super(message, false, cause);
	}
}
