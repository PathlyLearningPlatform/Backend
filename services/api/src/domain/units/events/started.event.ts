import { type DomainEvent, Event } from '@/domain/common';

export type UnitStartedEventPayload = {
	unitId: string;
};

export class UnitStartedEvent implements DomainEvent<UnitStartedEventPayload> {
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: UnitStartedEventPayload,
	) {
		this.eventName = Event.UNIT_STARTED;
	}
}
