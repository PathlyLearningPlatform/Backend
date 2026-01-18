import type { Provider } from '@nestjs/common';
import type {
	CreateUnitUseCase,
	FindOneUnitUseCase,
	FindUnitsUseCase,
	RemoveUnitUseCase,
	UpdateUnitUseCase,
} from '@/app/units/use-cases';
import { DiToken } from '@/infra/common/enums';

export const mockedFindUseCase: jest.Mocked<Partial<FindUnitsUseCase>> = {
	execute: jest.fn(),
};

export const mockedFindOneUseCase: jest.Mocked<Partial<FindOneUnitUseCase>> = {
	execute: jest.fn(),
};

export const mockedCreateUseCase: jest.Mocked<Partial<CreateUnitUseCase>> = {
	execute: jest.fn(),
};

export const mockedUpdateUseCase: jest.Mocked<Partial<UpdateUnitUseCase>> = {
	execute: jest.fn(),
};

export const mockedRemoveUseCase: jest.Mocked<Partial<RemoveUnitUseCase>> = {
	execute: jest.fn(),
};

export const mockedUseCases: Provider[] = [
	{
		provide: DiToken.FIND_UNITS_USE_CASE,
		useValue: mockedFindUseCase,
	},
	{
		provide: DiToken.FIND_ONE_UNIT_USE_CASE,
		useValue: mockedFindOneUseCase,
	},
	{
		provide: DiToken.CREATE_UNIT_USE_CASE,
		useValue: mockedCreateUseCase,
	},
	{
		provide: DiToken.UPDATE_UNIT_USE_CASE,
		useValue: mockedUpdateUseCase,
	},
	{
		provide: DiToken.REMOVE_UNIT_USE_CASE,
		useValue: mockedRemoveUseCase,
	},
];
