import { AppException } from '@/app/common';

export class LearningPathNotStartedException extends AppException {
	constructor(
		public readonly learningPathId: string,
		public readonly userId: string,
	) {
		const message = `User with id = ${userId} did not start learning path with id = ${learningPathId}`;

		super(message);
	}
}
