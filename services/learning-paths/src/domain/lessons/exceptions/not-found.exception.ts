import { LessonException } from './base.exception';

export class LessonNotFoundException extends LessonException {
	constructor(lessonId: string) {
		const message = `lesson with id = ${lessonId} not found`;

		super(message);

		this.message = message;
	}
}
