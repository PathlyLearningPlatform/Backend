import type { Provider } from '@nestjs/common';
import type {
	CreateLearningPathUseCase,
	FindLearningPathsUseCase,
	FindOneLearningPathUseCase,
	RemoveLearningPathUseCase,
	UpdateLearningPathUseCase,
} from '@/app/learning-paths/use-cases';
import { DiToken } from '@/infra/common/enums';

export const mockedFindLearningPathsUseCase: jest.Mocked<
	Partial<FindLearningPathsUseCase>
> = {
	execute: jest.fn(),
};

export const mockedFindOneLearningPathUseCase: jest.Mocked<
	Partial<FindOneLearningPathUseCase>
> = {
	execute: jest.fn(),
};

export const mockedCreateLearningPathUseCase: jest.Mocked<
	Partial<CreateLearningPathUseCase>
> = {
	execute: jest.fn(),
};

export const mockedUpdateLearningPathUseCase: jest.Mocked<
	Partial<UpdateLearningPathUseCase>
> = {
	execute: jest.fn(),
};

export const mockedRemoveLearningPathUseCase: jest.Mocked<
	Partial<RemoveLearningPathUseCase>
> = {
	execute: jest.fn(),
};

export const mockedUseCases: Provider[] = [
	{
		provide: DiToken.FIND_LEARNING_PATHS_USE_CASE,
		useValue: mockedFindLearningPathsUseCase,
	},
	{
		provide: DiToken.FIND_ONE_LEARNING_PATH_USE_CASE,
		useValue: mockedFindOneLearningPathUseCase,
	},
	{
		provide: DiToken.CREATE_LEARNING_PATH_USE_CASE,
		useValue: mockedCreateLearningPathUseCase,
	},
	{
		provide: DiToken.UPDATE_LEARNING_PATH_USE_CASE,
		useValue: mockedUpdateLearningPathUseCase,
	},
	{
		provide: DiToken.REMOVE_LEARNING_PATH_USE_CASE,
		useValue: mockedRemoveLearningPathUseCase,
	},
];
