import type { Provider } from '@nestjs/common';
import { DiToken, InMemoryEventBus, LearningPathsService } from '../common';
import {
	StartLearningPathHandler,
	RemoveLearningPathProgressHandler,
} from '@/app/learning-path-progress/commands';
import {
	FindLearningPathProgressByIdHandler,
	FindLearningPathProgressForUserHandler,
	ListLearningPathProgressHandler,
} from '@/app/learning-path-progress/queries';
import { PostgresLearningPathProgressRepository } from './postgres.repository';
import { PostgresLearningPathProgressReadRepository } from './postgres-read.repository';

export const learningPathProgressHandlersProvider: Provider[] = [
	{
		provide: DiToken.START_LEARNING_PATH_HANDLER,
		useFactory(
			learningPathProgressRepository: PostgresLearningPathProgressRepository,
			learningPathsService: LearningPathsService,
			eventBus: InMemoryEventBus,
		) {
			return new StartLearningPathHandler(
				learningPathProgressRepository,
				learningPathsService,
				eventBus,
			);
		},
		inject: [
			PostgresLearningPathProgressRepository,
			LearningPathsService,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_LEARNING_PATH_PROGRESS_HANDLER,
		useFactory(
			learningPathProgressRepository: PostgresLearningPathProgressRepository,
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
			learningPathProgressReadRepository: PostgresLearningPathProgressReadRepository,
		) {
			return new ListLearningPathProgressHandler(
				learningPathProgressReadRepository,
			);
		},
		inject: [PostgresLearningPathProgressReadRepository],
	},
	{
		provide: DiToken.FIND_LEARNING_PATH_PROGRESS_BY_ID_HANDLER,
		useFactory(
			learningPathProgressReadRepository: PostgresLearningPathProgressReadRepository,
		) {
			return new FindLearningPathProgressByIdHandler(
				learningPathProgressReadRepository,
			);
		},
		inject: [PostgresLearningPathProgressReadRepository],
	},
	{
		provide: DiToken.FIND_LEARNING_PATH_PROGRESS_FOR_USER_HANDLER,
		useFactory(
			learningPathProgressReadRepository: PostgresLearningPathProgressReadRepository,
		) {
			return new FindLearningPathProgressForUserHandler(
				learningPathProgressReadRepository,
			);
		},
		inject: [PostgresLearningPathProgressReadRepository],
	},
];
