import { LessonProgressException } from './base.exception';

export class LessonProgressNotFoundException extends LessonProgressException {
	constructor(id?: string, lessonId?: string, userId?: string) {
		const message = `Progress record with id = ${id} for lesson with id = ${lessonId} for user with id = ${userId} does not exist.`;

		super(message);
	}
}
