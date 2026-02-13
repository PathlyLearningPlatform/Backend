import { SectionException } from './base.exception';

/**
 * @description This exception is domain exception and should be thrown to when section is not found.
 */
export class SectionOrderException extends SectionException {
	constructor() {
		const message = `Section with that learningPathId and order already exists. Try different order or reorder existing sections.`;

		super(message);

		this.message = message;
	}
}
