import { ActivityException } from './base.exception';

/**
 * @description This exception is domain exception and should be thrown to when path is not found.
 */
export class ActivityNotFoundException extends ActivityException {
	constructor(activityId: string) {
		const message = `activity with id = ${activityId} not found`;

		super(message);

		this.message = message;
	}
}
