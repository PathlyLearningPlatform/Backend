import { type DomainEvent, Event } from "@/domain/common";

export class ActivityCompletedEvent implements DomainEvent {
	constructor(
		public readonly activityId: string,
		public readonly userId: string,
		public readonly lessonId: string,
		public readonly occuredAt: Date,
	) {
		this.eventName = Event.ACTIVITY_COMPLETED;
	}

	public readonly eventName: Event;
}
