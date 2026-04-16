import { DomainException } from '@/domain/common';

export class PreviousLessonNotCompletedException extends DomainException {
	constructor() {
		super('Previous lesson was not completed');
	}
}
