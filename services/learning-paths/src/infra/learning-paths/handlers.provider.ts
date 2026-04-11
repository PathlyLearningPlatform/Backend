import type { Provider } from '@nestjs/common';
import type { IEventBus } from '@/app/common';
import {
	CreateLearningPathHandler,
	RemoveLearningPathHandler,
	RemoveLearningPathProgressHandler,
	StartLearningPathHandler,
	UpdateLearningPathHandler,
} from '@/app/learning-paths/commands';
import type {
	ILearningPathProgressReadRepository,
	ILearningPathReadRepository,
} from '@/app/learning-paths/interfaces';
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
import { PostgresLearningPathProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresLearningPathReadRepository } from './postgres-read.repository';

export const learningPathHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_LEARNING_PATHS_HANDLER,
		useFactory(learningPathReadRepository: ILearningPathReadRepository) {
			return new ListLearningPathsHandler(learningPathReadRepository);
		},
		inject: [PostgresLearningPathReadRepository],
	},
	{
		provide: DiToken.FIND_LEARNING_PATH_BY_ID_HANDLER,
		useFactory(learningPathReadRepository: ILearningPathReadRepository) {
			return new FindLearningPathByIdHandler(learningPathReadRepository);
		},
		inject: [PostgresLearningPathReadRepository],
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
			learningPathReadRepository: ILearningPathReadRepository,
			eventBus: IEventBus,
		) {
			return new StartLearningPathHandler(
				learningPathProgressRepository,
				learningPathReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresLearningPathProgressRepository,
			PostgresLearningPathReadRepository,
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
			learningPathProgressReadRepository: ILearningPathProgressReadRepository,
		) {
			return new ListLearningPathProgressHandler(
				learningPathProgressReadRepository,
			);
		},
		inject: [PostgresLearningPathProgressReadRepository],
	},
	{
		provide: DiToken.FIND_LEARNING_PATH_PROGRESS_FOR_USER_HANDLER,
		useFactory(
			learningPathProgressReadRepository: ILearningPathProgressReadRepository,
		) {
			return new FindLearningPathProgressForUserHandler(
				learningPathProgressReadRepository,
			);
		},
		inject: [PostgresLearningPathProgressReadRepository],
	},
];
