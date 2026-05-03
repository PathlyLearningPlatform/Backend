import { AppException } from '@app/common';

export class ExerciseSubmissionNotFoundException extends AppException {
	constructor(public readonly submissionId: string) {
		const message = `Exercise submission with id = ${submissionId} was not found.`;
		super(message);
	}
}
