import { AppException } from '@app/common';

export class ExerciseProgressNotFoundException extends AppException {
	constructor(
		public readonly exerciseId: string,
		public readonly userId: string,
	) {
		const message = `Exercise progress with id = ${exerciseId} for user with id = ${userId} was not found.`;
		super(message);
	}
}
