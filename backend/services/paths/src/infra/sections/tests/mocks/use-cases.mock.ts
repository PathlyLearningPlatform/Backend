import type {
	CreateSectionUseCase,
	FindOneSectionUseCase,
	FindSectionsUseCase,
	RemoveSectionUseCase,
	UpdateSectionUseCase,
} from '@/app/sections/use-cases';

export const mockedFindUseCase: jest.Mocked<Partial<FindSectionsUseCase>> = {
	execute: jest.fn(),
};

export const mockedFindOneUseCase: jest.Mocked<Partial<FindOneSectionUseCase>> =
	{
		execute: jest.fn(),
	};

export const mockedCreateUseCase: jest.Mocked<Partial<CreateSectionUseCase>> = {
	execute: jest.fn(),
};

export const mockedUpdateUseCase: jest.Mocked<Partial<UpdateSectionUseCase>> = {
	execute: jest.fn(),
};

export const mockedRemoveUseCase: jest.Mocked<Partial<RemoveSectionUseCase>> = {
	execute: jest.fn(),
};
