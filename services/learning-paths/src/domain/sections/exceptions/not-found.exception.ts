import { SectionException } from './base.exception';

/**
 * @description This exception is domain exception and should be thrown to when section is not found.
 */
export class SectionNotFoundException extends SectionException {
	constructor(sectionId: string) {
		const message = `section with id = ${sectionId} not found`;

		super(message);

		this.message = message;
	}
}
