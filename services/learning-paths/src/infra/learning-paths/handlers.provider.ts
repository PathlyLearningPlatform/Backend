import type { Provider } from '@nestjs/common';
import type { ILearningPathRepository } from '@/domain/learning-paths/interfaces';
import { ILearningPathReadRepository } from '@/app/learning-paths/interfaces';
import { DiToken } from '../common/enums';
import { PostgresLearningPathRepository } from './postgres.repository';
import { PostgresLearningPathReadRepository } from './postgres-read.repository';
import {
	FindLearningPathByIdHandler,
	ListLearningPathsHandler,
} from '@/app/learning-paths/queries';
import {
	CreateLearningPathHandler,
	RemoveLearningPathHandler,
	UpdateLearningPathHandler,
} from '@/app/learning-paths/commands';

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
];
