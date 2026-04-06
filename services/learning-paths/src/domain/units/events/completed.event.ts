import { type DomainEvent, Event } from "@/domain/common";

export class UnitCompletedEvent implements DomainEvent {
	constructor(
		public readonly unitId: string,
		public readonly sectionId: string,
		public readonly userId: string,
		public readonly occuredAt: Date,
	) {
		this.eventName = Event.UNIT_COMPLETED;
	}

	public readonly eventName: Event;
}
