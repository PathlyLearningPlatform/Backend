import { PathException } from './path.exception';

/**
 * @description This exception is domain exception and should be thrown to when path is not found.
 */
export class PathNotFoundException extends PathException {
	constructor(pathId: string) {
		const message = `path with id = ${pathId} not found`;

		super(message);

		this.message = message;
	}
}
