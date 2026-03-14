import { AppException } from './app.exception';

export class ActivityNotFoundException extends AppException {
	constructor(public readonly activityId: string) {
		const message = `Activity with id = ${activityId} was not found.`;
		super(message);
	}
}
