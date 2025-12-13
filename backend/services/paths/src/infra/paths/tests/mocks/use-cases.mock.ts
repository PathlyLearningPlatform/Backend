import type {
	CreatePathUseCase,
	FindOnePathUseCase,
	FindPathsUseCase,
	RemovePathUseCase,
	UpdatePathUseCase,
} from '@/app/paths/use-cases';

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
