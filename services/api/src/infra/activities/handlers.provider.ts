import type { Provider } from '@nestjs/common';
import {
	CompleteActivityHandler,
	RemoveActivityHandler,
	RemoveActivityProgressHandler,
} from '@/app/activities/commands';
import {
	UpdateArticleHandler,
	FindArticleByIdHandler,
	ListArticlesHandler,
	AddArticleHandler,
} from '@app/articles';
import {
	FindActivityByIdHandler,
	FindActivityProgressForUserHandler,
	ListActivitiesHandler,
	ListActivityProgressHandler,
} from '@/app/activities/queries';
import type { IEventBus } from '@/app/common';
import { ReorderActivityHandler } from '@/app/lessons/commands';
import type {
	IActivityProgressRepository,
	IActivityRepository,
} from '@/domain/activities';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { InMemoryEventBus } from '@infra/common';
import { DiToken } from '@infra/common';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { PostgresActivityRepository } from './postgres.repository';
import { PostgresActivityProgressRepository } from './postgres-progress.repository';
import { PostgresLessonProgressRepository } from '../lessons/postgres-progress.repository';
import type { ILessonProgressRepository } from '@/domain/lessons/repositories';
import { OnActivityCompletedHandler } from '@/app/activities/events';

export const activityHandlersProvider: Provider[] = [
	// ──────────────────────────────────────────────
	// Queries
	// ──────────────────────────────────────────────
	{
		provide: DiToken.LIST_ACTIVITIES_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new ListActivitiesHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.FIND_ACTIVITY_BY_ID_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new FindActivityByIdHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.LIST_ACTIVITY_PROGRESS_HANDLER,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new ListActivityProgressHandler(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	{
		provide: DiToken.FIND_ACTIVITY_PROGRESS_FOR_USER_HANDLER,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new FindActivityProgressForUserHandler(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	// ──────────────────────────────────────────────
	// Commands
	// ──────────────────────────────────────────────
	{
		provide: DiToken.REMOVE_ACTIVITY_HANDLER,
		useFactory(
			activityRepository: IActivityRepository,
			lessonRepository: ILessonRepository,
		) {
			return new RemoveActivityHandler(activityRepository, lessonRepository);
		},
		inject: [PostgresActivityRepository, PostgresLessonRepository],
	},
	{
		provide: DiToken.REORDER_ACTIVITY_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			activityRepository: IActivityRepository,
		) {
			return new ReorderActivityHandler(lessonRepository, activityRepository);
		},
		inject: [PostgresLessonRepository, PostgresActivityRepository],
	},
	{
		provide: DiToken.COMPLETE_ACTIVITY_HANDLER,
		useFactory(
			activityProgressRepository: IActivityProgressRepository,
			activityRepository: IActivityRepository,
			lessonProgressRepository: ILessonProgressRepository,
			eventBus: IEventBus,
		) {
			return new CompleteActivityHandler(
				activityProgressRepository,
				activityRepository,
				lessonProgressRepository,
				eventBus,
			);
		},
		inject: [
			PostgresActivityProgressRepository,
			PostgresActivityRepository,
			PostgresLessonProgressRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_ACTIVITY_PROGRESS_HANDLER,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new RemoveActivityProgressHandler(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	// ──────────────────────────────────────────────
	// Events
	// ──────────────────────────────────────────────
	{
		provide: DiToken.ON_ACTIVITY_COMPLETED_HANDLER,
		useFactory(
			lessonProgressRepository: PostgresLessonProgressRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnActivityCompletedHandler(lessonProgressRepository, eventBus);
		},
		inject: [PostgresLessonProgressRepository, InMemoryEventBus],
	},
];
