import { ActivityException } from './base.exception';

/**
 * @description This exception is domain exception and should be thrown to when section is not found.
 */
export class ActivityOrderException extends ActivityException {
	constructor() {
		const message = `Activity with that lessonId and order already exists. Try different order or reorder existing activities.`;

		super(message);

		this.message = message;
	}
}
