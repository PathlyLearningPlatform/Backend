import type { Provider } from '@nestjs/common';
import type {
	CreateSectionUseCase,
	FindOneSectionUseCase,
	FindSectionsUseCase,
	RemoveSectionUseCase,
	UpdateSectionUseCase,
} from '@/app/sections/use-cases';
import { DiToken } from '@/infra/common/enums';

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

export const mockedUseCases: Provider[] = [
	{
		provide: DiToken.FIND_SECTIONS_USE_CASE,
		useValue: mockedFindUseCase,
	},
	{
		provide: DiToken.FIND_ONE_SECTION_USE_CASE,
		useValue: mockedFindOneUseCase,
	},
	{
		provide: DiToken.CREATE_SECTION_USE_CASE,
		useValue: mockedCreateUseCase,
	},
	{
		provide: DiToken.UPDATE_SECTION_USE_CASE,
		useValue: mockedUpdateUseCase,
	},
	{
		provide: DiToken.REMOVE_SECTION_USE_CASE,
		useValue: mockedRemoveUseCase,
	},
];
