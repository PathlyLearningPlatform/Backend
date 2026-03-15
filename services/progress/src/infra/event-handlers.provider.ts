import { Provider } from '@nestjs/common';
import { DiToken, InMemoryEventBus } from './common';
import { OnActivityCompletedHandler } from '@/app/activity-progress/events';
import { PostgresLessonProgressRepository } from './lesson-progress/postgres.repository';
import { PostgresLessonProgressReadRepository } from './lesson-progress/postgres-read.repository';

export const eventHandlersProvider: Provider[] = [
	{
		provide: DiToken.ON_ACTIVITY_COMPLETED_HANDLER,
		useFactory(
			lessonProgressRepository: PostgresLessonProgressRepository,
			lessonProgressReadRepository: PostgresLessonProgressReadRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnActivityCompletedHandler(
				lessonProgressRepository,
				lessonProgressReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresLessonProgressRepository,
			PostgresLessonProgressReadRepository,
			InMemoryEventBus,
		],
	},
];
