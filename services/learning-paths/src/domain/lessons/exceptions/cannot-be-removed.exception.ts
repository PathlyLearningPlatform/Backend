import { LessonException } from './base.exception';

export class LessonCannotBeRemovedException extends LessonException {
	constructor(lessonId: string) {
		const message = `lesson with id = ${lessonId} cannot be removed`;

		super(message);

		this.message = message;
	}
}
