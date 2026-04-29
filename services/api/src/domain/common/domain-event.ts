export interface DomainEvent<T = any> {
	readonly eventName: string;
	readonly occuredAt: Date;
	readonly userId: string | null;
	readonly payload: T;
}
