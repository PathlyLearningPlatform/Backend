import { Provider } from '@nestjs/common';
import { DiToken } from '../common';
import { OnActivityCompletedHandler } from '@/app/handlers';
import { PostgresLessonProgressRepository } from '../lesson-progress/postgres.repository';
import { InMemoryEventBus } from '../common/modules/events/event-bus.provider';

export const handlersProvider: Provider[] = [
	{
		provide: DiToken.ON_ACTIVITY_COMPLETED_HANDLER,
		useFactory(
			lessonsRepository: PostgresLessonProgressRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnActivityCompletedHandler(lessonsRepository, eventBus);
		},
		inject: [PostgresLessonProgressRepository, InMemoryEventBus],
	},
];
