import { DomainException } from '@/domain/common';

export class LessonAlreadyExistsException extends DomainException {
	constructor(public readonly id: string) {
		const message = `Lesson with id = ${id} already exists.`;
		super(message);
	}
}
