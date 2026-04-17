import type { Provider } from '@nestjs/common';
import type { IEventBus } from '@/app/common';
import {
	CreateLearningPathHandler,
	RemoveLearningPathHandler,
	RemoveLearningPathProgressHandler,
	StartLearningPathHandler,
	UpdateLearningPathHandler,
} from '@/app/learning-paths/commands';
import {
	FindLearningPathByIdHandler,
	FindLearningPathProgressForUserHandler,
	ListLearningPathProgressHandler,
	ListLearningPathsHandler,
} from '@/app/learning-paths/queries';
import type {
	ILearningPathProgressRepository,
	ILearningPathRepository,
} from '@/domain/learning-paths';
import { InMemoryEventBus } from '@infra/common';
import { DiToken } from '@infra/common';
import { PostgresLearningPathRepository } from './postgres.repository';
import { PostgresLearningPathProgressRepository } from './postgres-progress.repository';
import { OnLearningPathCompletedHandler } from '@/app/learning-paths/events';

export const learningPathHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_LEARNING_PATHS_HANDLER,
		useFactory(learningPathRepository: ILearningPathRepository) {
			return new ListLearningPathsHandler(learningPathRepository);
		},
		inject: [PostgresLearningPathRepository],
	},
	{
		provide: DiToken.FIND_LEARNING_PATH_BY_ID_HANDLER,
		useFactory(learningPathRepository: ILearningPathRepository) {
			return new FindLearningPathByIdHandler(learningPathRepository);
		},
		inject: [PostgresLearningPathRepository],
	},
	{
		provide: DiToken.CREATE_LEARNING_PATH_HANDLER,
		useFactory(learningPathRepository: ILearningPathRepository) {
			return new CreateLearningPathHandler(learningPathRepository);
		},
		inject: [PostgresLearningPathRepository],
	},
	{
		provide: DiToken.UPDATE_LEARNING_PATH_HANDLER,
		useFactory(learningPathRepository: ILearningPathRepository) {
			return new UpdateLearningPathHandler(learningPathRepository);
		},
		inject: [PostgresLearningPathRepository],
	},
	{
		provide: DiToken.REMOVE_LEARNING_PATH_HANDLER,
		useFactory(learningPathRepository: ILearningPathRepository) {
			return new RemoveLearningPathHandler(learningPathRepository);
		},
		inject: [PostgresLearningPathRepository],
	},
	{
		provide: DiToken.START_LEARNING_PATH_HANDLER,
		useFactory(
			learningPathProgressRepository: ILearningPathProgressRepository,
			learningPathRepository: ILearningPathRepository,
			eventBus: IEventBus,
		) {
			return new StartLearningPathHandler(
				learningPathProgressRepository,
				learningPathRepository,
				eventBus,
			);
		},
		inject: [
			PostgresLearningPathProgressRepository,
			PostgresLearningPathRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_LEARNING_PATH_PROGRESS_HANDLER,
		useFactory(
			learningPathProgressRepository: ILearningPathProgressRepository,
		) {
			return new RemoveLearningPathProgressHandler(
				learningPathProgressRepository,
			);
		},
		inject: [PostgresLearningPathProgressRepository],
	},
	{
		provide: DiToken.LIST_LEARNING_PATH_PROGRESS_HANDLER,
		useFactory(
			learningPathProgressRepository: ILearningPathProgressRepository,
		) {
			return new ListLearningPathProgressHandler(
				learningPathProgressRepository,
			);
		},
		inject: [PostgresLearningPathProgressRepository],
	},
	{
		provide: DiToken.FIND_LEARNING_PATH_PROGRESS_FOR_USER_HANDLER,
		useFactory(
			learningPathProgressRepository: ILearningPathProgressRepository,
		) {
			return new FindLearningPathProgressForUserHandler(
				learningPathProgressRepository,
			);
		},
		inject: [PostgresLearningPathProgressRepository],
	},
	{
		provide: DiToken.ON_LEARNING_PATH_COMPLETED_HANDLER,
		useFactory() {
			return new OnLearningPathCompletedHandler();
		},
	},
];
