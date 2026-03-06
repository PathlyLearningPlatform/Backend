import { DomainEvent } from './domain-event';

export abstract class AggregateRoot<ID, Props> {
	protected readonly _id: ID;
	private _events: DomainEvent[];

	constructor(id: ID) {
		this._id = id;
		this._events = [];
	}

	get id(): ID {
		return this._id;
	}

	get events(): readonly DomainEvent[] {
		return [...this._events];
	}

	protected addEvent(event: DomainEvent): void {
		this._events.push(event);
	}

	pullEvents(): DomainEvent[] {
		const events = [...this._events];
		this._events = [];
		return events;
	}
}
