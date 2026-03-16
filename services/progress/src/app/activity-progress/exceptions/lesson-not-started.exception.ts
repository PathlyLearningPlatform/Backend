import { AppException } from '@/app/common';

export class LessonNotStartedException extends AppException {
	constructor(
		public readonly lessonId: string,
		public readonly userId: string,
	) {
		const message = `User with id = ${userId} did not start lesson with id = ${lessonId}`;

		super(message);
	}
}
