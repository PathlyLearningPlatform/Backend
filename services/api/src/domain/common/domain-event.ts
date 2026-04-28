export interface DomainEvent {
	readonly eventName: string;
	readonly occuredAt: Date;
	readonly userId: string | null;
}
