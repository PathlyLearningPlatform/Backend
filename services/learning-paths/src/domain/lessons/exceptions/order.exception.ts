import { LessonException } from './base.exception';

/**
 * @description This exception is domain exception and should be thrown to when section is not found.
 */
export class LessonOrderException extends LessonException {
	constructor() {
		const message = `Lesson with that unitId and order already exists. Try different order or reorder existing lessons.`;

		super(message);

		this.message = message;
	}
}
