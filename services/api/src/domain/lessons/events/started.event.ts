import { type DomainEvent, Event } from '@/domain/common';

export type LessonStartedEventPayload = {
	lessonId: string;
};

export class LessonStartedEvent
	implements DomainEvent<LessonStartedEventPayload>
{
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: LessonStartedEventPayload,
	) {
		this.eventName = Event.LESSON_STARTED;
	}
}
