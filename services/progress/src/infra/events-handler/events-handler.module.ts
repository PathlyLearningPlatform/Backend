import { ActivityProgressModule } from '@/infra/activity-progress/activity-progress.module';
import { LessonProgressModule } from '@/infra/lesson-progress/lesson-progress.module';
import { Module } from '@nestjs/common';
import { handlersProvider } from './handlers.provider';
import { EventHandler } from './events-handler.provider';

@Module({
	imports: [ActivityProgressModule, LessonProgressModule],
	providers: [...handlersProvider, EventHandler],
})
export class EventsHandlerModule {
	constructor(private readonly eventHandler: EventHandler) {}
}
