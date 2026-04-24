import { AppException } from '@app/common';

export class ProjectProgressNotFoundException extends AppException {
	constructor(
		public readonly projectId: string,
		public readonly userId: string,
	) {
		const message = `Project progress with id = ${projectId} for user with id = ${userId} was not found.`;
		super(message);
	}
}
