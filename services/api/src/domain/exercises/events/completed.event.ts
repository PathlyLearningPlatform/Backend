import { type DomainEvent, Event } from '@/domain/common';

export type ExerciseCompletedEventPayload = {
	exerciseId: string;
};

export class ExerciseCompletedEvent
	implements DomainEvent<ExerciseCompletedEventPayload>
{
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: ExerciseCompletedEventPayload,
	) {
		this.eventName = Event.EXERCISE_COMPLETED;
	}
}
