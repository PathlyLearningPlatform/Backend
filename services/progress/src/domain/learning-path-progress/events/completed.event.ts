import { DomainEvent, Event } from '@/domain/common';

export class LearningPathCompletedEvent implements DomainEvent {
	constructor(
		public readonly learningPathId: string,
		public readonly userId: string,
		public readonly occuredAt: Date,
	) {
		this.eventName = Event.LEARNING_PATH_COMPLETED;
	}

	public readonly eventName: Event;
}
