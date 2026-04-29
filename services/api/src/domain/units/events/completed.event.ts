import { type DomainEvent, Event } from '@/domain/common';

export type UnitCompletedEventPayload = {
	readonly unitId: string;
	readonly sectionId: string;
};

export class UnitCompletedEvent
	implements DomainEvent<UnitCompletedEventPayload>
{
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: UnitCompletedEventPayload,
	) {
		this.eventName = Event.UNIT_COMPLETED;
	}
}
