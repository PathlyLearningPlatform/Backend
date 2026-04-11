import { AppException } from "@/app/common";

export class LessonProgressNotFoundException extends AppException {
	constructor(public readonly id: string) {
		const message = `Lesson progress with id = ${id} was not found`;

		super(message);
	}
}
