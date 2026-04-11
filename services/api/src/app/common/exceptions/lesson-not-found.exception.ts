import { AppException } from "./app.exception";

export class LessonNotFoundException extends AppException {
	constructor(public readonly lessonId: string) {
		const message = `Lesson with id = ${lessonId} was not found.`;
		super(message);
	}
}
