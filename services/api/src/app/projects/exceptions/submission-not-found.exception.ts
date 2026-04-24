import { AppException } from '@app/common';

export class ProjectSubmissionNotFoundException extends AppException {
	constructor(public readonly submissionId: string) {
		const message = `Project submission with id = ${submissionId} was not found.`;
		super(message);
	}
}
