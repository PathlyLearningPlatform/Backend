import { AppException } from './app.exception';

export class ConfigException extends AppException {
	constructor(message: string, cause: unknown = null) {
		super(message, false, cause);
	}
}
