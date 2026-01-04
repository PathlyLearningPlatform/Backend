import type { Provider } from '@nestjs/common';
import type { ILearningPathsRepository } from '@/app/learning-paths/interfaces';
import {
	CreateLearningPathUseCase,
	FindLearningPathsUseCase,
	FindOneLearningPathUseCase,
	RemoveLearningPathUseCase,
	UpdateLearningPathUseCase,
} from '@/app/learning-paths/use-cases';
import { DiToken } from '../common/enums';
import { PostgresLearningPathsRepository } from './postgres.repository';

export const learningPathsUseCasesProvider: Provider[] = [
	{
		provide: DiToken.FIND_LEARNING_PATHS_USE_CASE,
		useFactory(pathsRepository: ILearningPathsRepository) {
			return new FindLearningPathsUseCase(pathsRepository);
		},
		inject: [PostgresLearningPathsRepository],
	},
	{
		provide: DiToken.FIND_ONE_LEARNING_PATH_USE_CASE,
		useFactory(pathsRepository: ILearningPathsRepository) {
			return new FindOneLearningPathUseCase(pathsRepository);
		},
		inject: [PostgresLearningPathsRepository],
	},
	{
		provide: DiToken.CREATE_LEARNING_PATH_USE_CASE,
		useFactory(pathsRepository: ILearningPathsRepository) {
			return new CreateLearningPathUseCase(pathsRepository);
		},
		inject: [PostgresLearningPathsRepository],
	},
	{
		provide: DiToken.UPDATE_LEARNING_PATH_USE_CASE,
		useFactory(pathsRepository: ILearningPathsRepository) {
			return new UpdateLearningPathUseCase(pathsRepository);
		},
		inject: [PostgresLearningPathsRepository],
	},
	{
		provide: DiToken.REMOVE_LEARNING_PATH_USE_CASE,
		useFactory(pathsRepository: ILearningPathsRepository) {
			return new RemoveLearningPathUseCase(pathsRepository);
		},
		inject: [PostgresLearningPathsRepository],
	},
];
