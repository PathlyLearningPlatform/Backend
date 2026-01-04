import { AppException } from './app.exception.js';

export class ConfigException extends AppException {
  constructor(message: string, cause: unknown = null) {
    super(message, false, cause);
  }
}
