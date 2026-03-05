import { DomainEvent, Event } from '@/domain/common';

export class ActivityCompletedEvent extends DomainEvent {
	constructor(
		public readonly activityId: string,
		public readonly userId: string,
		public readonly lessonId: string,
	) {
		super(Event.ACTIVITY_COMPLETED);
	}
}
