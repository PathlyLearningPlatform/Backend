import { ActivityProgressException } from './base.exception';

export class ActivityProgressNotFoundException extends ActivityProgressException {
	constructor(userId: string, activityId: string) {
		const message = `Progress record for activity with id = ${activityId} for user with id = ${userId} does not exist.`;

		super(message);
	}
}
