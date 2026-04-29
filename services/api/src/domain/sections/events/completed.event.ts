import { type DomainEvent, Event } from '@/domain/common';

export type SectionCompletedEventPayload = {
	readonly sectionId: string;
	readonly learningPathId: string;
};

export class SectionCompletedEvent
	implements DomainEvent<SectionCompletedEventPayload>
{
	public readonly eventName: Event;

	constructor(
		public readonly userId: string,
		public readonly occuredAt: Date,
		public readonly payload: SectionCompletedEventPayload,
	) {
		this.eventName = Event.SECTION_COMPLETED;
	}
}
