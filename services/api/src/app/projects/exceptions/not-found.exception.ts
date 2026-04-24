import { AppException } from '@app/common';

export class ProjectNotFoundException extends AppException {
	constructor(public readonly projectId: string) {
		const message = `Project with id = ${projectId} was not found.`;
		super(message);
	}
}
