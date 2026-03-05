import { Global, Module } from '@nestjs/common';
import { InMemoryEventBus } from './event-bus.provider';

@Global()
@Module({
	imports: [],
	providers: [InMemoryEventBus],
	exports: [InMemoryEventBus],
})
export class EventsModule {}
