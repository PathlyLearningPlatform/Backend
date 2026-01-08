import { LessonException } from './base.exception';

export class LessonCannotBeRmovedException extends LessonException {
	constructor(lessonId: string) {
		const message = `lesson with id = ${lessonId} cannot be removed`;

		super(message);

		this.message = message;
	}
}
