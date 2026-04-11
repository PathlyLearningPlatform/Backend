export interface IEventHandler<Event> {
	handle(event: Event): Promise<void>;
}
