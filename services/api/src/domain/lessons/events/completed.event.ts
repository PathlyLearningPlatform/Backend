import { type DomainEvent, Event } from "@/domain/common";

export class LessonCompletedEvent implements DomainEvent {
	constructor(
		public readonly lessonId: string,
		public readonly unitId: string,
		public readonly userId: string,
		public readonly occuredAt: Date,
	) {
		this.eventName = Event.LESSON_COMPLETED;
	}

	public readonly eventName: Event;
}
