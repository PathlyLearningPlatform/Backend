import { IEventBus } from '@/app/common/interfaces';
import { DomainEvent } from '@/domain/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InMemoryEventBus implements IEventBus {
	constructor(private readonly eventEmitter: EventEmitter2) {}

	async publish(events: DomainEvent[]): Promise<void> {
		for (const event of events) {
			this.eventEmitter.emit(event.eventName, event);
		}
	}
}
