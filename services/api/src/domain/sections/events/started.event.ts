import { type DomainEvent, Event } from '@/domain/common';

export type SectionStartedEventPayload = {
	sectionId: string;
};

export class SectionStartedEvent
	implements DomainEvent<SectionStartedEventPayload>
{
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: SectionStartedEventPayload,
	) {
		this.eventName = Event.SECTION_STARTED;
	}
}
