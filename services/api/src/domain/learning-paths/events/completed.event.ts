import { type DomainEvent, Event } from '@/domain/common';

export type LearningPathCompletedEventPayload = {
	learningPathId: string;
};

export class LearningPathCompletedEvent
	implements DomainEvent<LearningPathCompletedEventPayload>
{
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: LearningPathCompletedEventPayload,
	) {
		this.eventName = Event.LEARNING_PATH_COMPLETED;
	}
}
