import { ActivityProgressException } from './base.exception';

export class ActivityProgressNotFoundException extends ActivityProgressException {
	constructor(id?: string, activityId?: string, userId?: string) {
		const message = `Progress record with id = ${id} for activity with id = ${activityId} for user with id = ${userId} does not exist.`;

		super(message);
	}
}
