export interface DomainEvent {
	readonly eventName: string;
	readonly occuredAt: Date;
}
