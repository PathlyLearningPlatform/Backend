import { Provider } from '@nestjs/common';
import { DiToken, InMemoryEventBus, LearningPathsService } from '../common';
import {
	CompleteActivityHandler,
	RemoveActivityProgressHandler,
} from '@/app/activity-progress/commands';
import { PostgresActivityProgressRepository } from './postgres.repository';
import { PostgresLessonProgressReadRepository } from '../lesson-progress/postgres-read.repository';
import {
	FindActivityProgressByIdHandler,
	FindActivityProgressForUserHandler,
	ListActivityProgressHandler,
} from '@/app/activity-progress/queries';
import { PostgresActivityProgressReadRepository } from './postgres-read.repository';

export const activityProgressHandlersProvider: Provider[] = [
	{
		provide: DiToken.COMPLETE_ACTIVITY_HANDLER,
		useFactory(
			activityProgressRepository: PostgresActivityProgressRepository,
			lessonProgressReadRepository: PostgresLessonProgressReadRepository,
			eventBus: InMemoryEventBus,
			learningPathsService: LearningPathsService,
		) {
			return new CompleteActivityHandler(
				activityProgressRepository,
				lessonProgressReadRepository,
				learningPathsService,
				eventBus,
			);
		},
		inject: [
			PostgresActivityProgressRepository,
			PostgresLessonProgressReadRepository,
			InMemoryEventBus,
			LearningPathsService,
		],
	},
	{
		provide: DiToken.REMOVE_ACTIVITY_PROGRESS_HANDLER,
		useFactory(activityProgressRepository: PostgresActivityProgressRepository) {
			return new RemoveActivityProgressHandler(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	{
		provide: DiToken.LIST_ACTIVITY_PROGRESS_HANDLER,
		useFactory(
			activityProgressReadRepository: PostgresActivityProgressReadRepository,
		) {
			return new ListActivityProgressHandler(activityProgressReadRepository);
		},
		inject: [PostgresActivityProgressReadRepository],
	},
	{
		provide: DiToken.FIND_ACTIVITY_PROGRESS_BY_ID_HANDLER,
		useFactory(
			activityProgressReadRepository: PostgresActivityProgressReadRepository,
		) {
			return new FindActivityProgressByIdHandler(
				activityProgressReadRepository,
			);
		},
		inject: [PostgresActivityProgressReadRepository],
	},
	{
		provide: DiToken.FIND_ACTIVITY_PROGRESS_FOR_USER_HANDLER,
		useFactory(
			activityProgressReadRepository: PostgresActivityProgressReadRepository,
		) {
			return new FindActivityProgressForUserHandler(
				activityProgressReadRepository,
			);
		},
		inject: [PostgresActivityProgressReadRepository],
	},
];
