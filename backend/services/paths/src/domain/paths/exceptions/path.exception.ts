/**
 * @description This exception is domain exception and is base class for all path related exceptions.
 */
export class PathException extends Error {
	constructor(message: string) {
		super(message, {});
	}
}
