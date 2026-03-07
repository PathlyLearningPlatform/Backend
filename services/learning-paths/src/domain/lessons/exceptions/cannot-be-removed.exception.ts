import { DomainException } from '@/domain/common';

export class LessonCannotBeRemovedException extends DomainException {
	constructor(public readonly lessonId: string) {
		const message = `Lesson with id = ${lessonId} cannot be removed.`;
		super(message);
	}
}
