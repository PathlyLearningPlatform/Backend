/**
 * @description This exception is domain exception and is base class for all section related exceptions.
 */
export class SectionException extends Error {
	constructor(message: string) {
		super(message, {});
	}
}
