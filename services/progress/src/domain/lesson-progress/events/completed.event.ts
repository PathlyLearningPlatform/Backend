import { DomainEvent, Event } from '@/domain/common';

export class LessonCompletedEvent extends DomainEvent {
	constructor(
		public readonly lessonId: string,
		public readonly userId: string,
	) {
		super(Event.LESSON_COMPLETED);
	}
}
