import { Event } from './value-objects';

export interface DomainEvent {
	readonly eventName: Event;
	readonly occuredAt: Date;
}
