import { Provider } from '@nestjs/common';
import {
	CreateUnitUseCase,
	FindOneUnitUseCase,
	FindUnitsUseCase,
	RemoveUnitUseCase,
	UpdateUnitUseCase,
} from '@/app/units/use-cases';
import { DiToken } from '../common/enums';
import { PostgresSectionsRepository } from '../sections/postgres.repository';
import { PostgresUnitsRepository } from './postgres.repository';
import { IUnitsRepository } from '@/app/units/interfaces';
import { ISectionsRepository } from '@/app/sections/interfaces';

export const unitsUseCasesProvider: Provider[] = [
	{
		provide: DiToken.FIND_UNITS_USE_CASE,
		useFactory(unitsRepository: IUnitsRepository) {
			return new FindUnitsUseCase(unitsRepository);
		},
		inject: [PostgresUnitsRepository],
	},
	{
		provide: DiToken.FIND_ONE_UNIT_USE_CASE,
		useFactory(unitsRepository: IUnitsRepository) {
			return new FindOneUnitUseCase(unitsRepository);
		},
		inject: [PostgresUnitsRepository],
	},
	{
		provide: DiToken.CREATE_UNIT_USE_CASE,
		useFactory(
			unitsRepository: IUnitsRepository,
			sectionsRepository: ISectionsRepository,
		) {
			return new CreateUnitUseCase(unitsRepository, sectionsRepository);
		},
		inject: [PostgresUnitsRepository, PostgresSectionsRepository],
	},
	{
		provide: DiToken.UPDATE_UNIT_USE_CASE,
		useFactory(unitsRepository: IUnitsRepository) {
			return new UpdateUnitUseCase(unitsRepository);
		},
		inject: [PostgresUnitsRepository],
	},
	{
		provide: DiToken.REMOVE_UNIT_USE_CASE,
		useFactory(unitsRepository: PostgresUnitsRepository) {
			return new RemoveUnitUseCase(unitsRepository);
		},
		inject: [PostgresUnitsRepository],
	},
];
