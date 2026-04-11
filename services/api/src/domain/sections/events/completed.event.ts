import { type DomainEvent, Event } from "@/domain/common";

export class SectionCompletedEvent implements DomainEvent {
	constructor(
		public readonly sectionId: string,
		public readonly learningPathId: string,
		public readonly userId: string,
		public readonly occuredAt: Date,
	) {
		this.eventName = Event.SECTION_COMPLETED;
	}

	public readonly eventName: Event;
}
