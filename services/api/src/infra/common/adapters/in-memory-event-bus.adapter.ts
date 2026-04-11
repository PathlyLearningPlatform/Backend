import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IEventBus } from '@/app/common';
import type { DomainEvent } from '@/domain/common';

@Injectable()
export class InMemoryEventBus implements IEventBus {
	constructor(
		@Inject(EventEmitter2)
		private readonly eventEmitter: EventEmitter2,
	) {}

	async publish(events: DomainEvent[]): Promise<void> {
		for (const event of events) {
			this.eventEmitter.emit(event.eventName, event);
		}
	}
}
