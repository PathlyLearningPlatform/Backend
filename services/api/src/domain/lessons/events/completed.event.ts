import { type DomainEvent, Event } from '@/domain/common';

export type LessonCompletedEventPayload = {
	lessonId: string;
	unitId: string;
};

export class LessonCompletedEvent
	implements DomainEvent<LessonCompletedEventPayload>
{
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: LessonCompletedEventPayload,
	) {
		this.eventName = Event.LESSON_COMPLETED;
	}
}
