import { AppException } from '@app/common';

export class ExerciseNotFoundException extends AppException {
	constructor(public readonly exerciseId: string) {
		const message = `Exercise with id = ${exerciseId} was not found.`;
		super(message);
	}
}
