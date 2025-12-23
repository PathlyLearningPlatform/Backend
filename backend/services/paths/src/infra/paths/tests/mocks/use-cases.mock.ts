import type {
	CreatePathUseCase,
	FindOnePathUseCase,
	FindPathsUseCase,
	RemovePathUseCase,
	UpdatePathUseCase,
} from '@/app/paths/use-cases';

import { DiToken } from '@/infra/common/enums';
import { Provider } from '@nestjs/common';

export const mockedFindUseCase: jest.Mocked<Partial<FindPathsUseCase>> = {
	execute: jest.fn(),
};

export const mockedFindOneUseCase: jest.Mocked<Partial<FindOnePathUseCase>> = {
	execute: jest.fn(),
};

export const mockedCreateUseCase: jest.Mocked<Partial<CreatePathUseCase>> = {
	execute: jest.fn(),
};

export const mockedUpdateUseCase: jest.Mocked<Partial<UpdatePathUseCase>> = {
	execute: jest.fn(),
};

export const mockedRemoveUseCase: jest.Mocked<Partial<RemovePathUseCase>> = {
	execute: jest.fn(),
};

export const mockedUseCases: Provider[] = [
	{
		provide: DiToken.FIND_PATHS_USE_CASE,
		useValue: mockedFindUseCase,
	},
	{
		provide: DiToken.FIND_ONE_PATH_USE_CASE,
		useValue: mockedFindOneUseCase,
	},
	{
		provide: DiToken.CREATE_PATH_USE_CASE,
		useValue: mockedCreateUseCase,
	},
	{
		provide: DiToken.UPDATE_PATH_USE_CASE,
		useValue: mockedUpdateUseCase,
	},
	{
		provide: DiToken.REMOVE_PATH_USE_CASE,
		useValue: mockedRemoveUseCase,
	},
];
