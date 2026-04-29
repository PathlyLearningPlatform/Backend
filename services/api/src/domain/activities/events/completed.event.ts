import { type DomainEvent, Event } from '@/domain/common';

export type ActivityCompletedEventPayload = {
	lessonId: string;
	activityId: string;
};

export class ActivityCompletedEvent
	implements DomainEvent<ActivityCompletedEventPayload>
{
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: ActivityCompletedEventPayload,
	) {
		this.eventName = Event.ACTIVITY_COMPLETED;
	}
}
