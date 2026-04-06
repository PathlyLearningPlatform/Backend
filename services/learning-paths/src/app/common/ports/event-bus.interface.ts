import type { DomainEvent } from "@/domain/common";

export interface IEventBus {
	publish(events: DomainEvent[]): Promise<void>;
}
