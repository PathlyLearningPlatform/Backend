import { type DomainEvent, Event } from '@/domain/common';

export type LearningPathStartedEventPayload = {
	learningPathId: string;
};

export class LearningPathStartedEvent
	implements DomainEvent<LearningPathStartedEventPayload>
{
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: LearningPathStartedEventPayload,
	) {
		this.eventName = Event.LEARNING_PATH_STARTED;
	}
}
