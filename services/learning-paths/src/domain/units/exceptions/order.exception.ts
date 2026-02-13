import { UnitException } from './base.exception';

/**
 * @description This exception is domain exception and should be thrown to when section is not found.
 */
export class UnitOrderException extends UnitException {
	constructor() {
		const message = `Unit with that sectionId and order already exists. Try different order or reorder existing units.`;

		super(message);

		this.message = message;
	}
}
