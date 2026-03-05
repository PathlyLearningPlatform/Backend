export class LessonNotFoundException extends Error {
	constructor(public readonly id: string) {
		const message = `Lesson with id = ${id} not found.`;

		super(message);
	}
}
