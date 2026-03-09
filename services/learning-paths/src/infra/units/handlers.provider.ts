import type { Provider } from '@nestjs/common';
import type { IUnitRepository } from '@/domain/units/interfaces';
import type { IUnitReadRepository } from '@/app/units/interfaces';
import type { ILessonRepository } from '@/domain/lessons/interfaces';
import { DiToken } from '../common/enums';
import { PostgresUnitRepository } from './postgres.repository';
import { PostgresUnitReadRepository } from './postgres-read.repository';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { ListUnitsHandler, FindUnitByIdHandler } from '@/app/units/queries';
import {
	UpdateUnitHandler,
	RemoveUnitHandler,
	AddLessonHandler,
	ReorderLessonHandler,
} from '@/app/units/commands';
import type { ISectionRepository } from '@/domain/sections/interfaces';
import { PostgresSectionRepository } from '../sections/postgres.repository';
import { AddUnitHandler, ReorderUnitHandler } from '@/app/sections/commands';

export const unitHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_UNITS_HANDLER,
		useFactory(unitReadRepository: IUnitReadRepository) {
			return new ListUnitsHandler(unitReadRepository);
		},
		inject: [PostgresUnitReadRepository],
	},
	{
		provide: DiToken.FIND_UNIT_BY_ID_HANDLER,
		useFactory(unitReadRepository: IUnitReadRepository) {
			return new FindUnitByIdHandler(unitReadRepository);
		},
		inject: [PostgresUnitReadRepository],
	},
	{
		provide: DiToken.UPDATE_UNIT_HANDLER,
		useFactory(unitRepository: IUnitRepository) {
			return new UpdateUnitHandler(unitRepository);
		},
		inject: [PostgresUnitRepository],
	},
	{
		provide: DiToken.REMOVE_UNIT_HANDLER,
		useFactory(
			sectionRepository: ISectionRepository,
			unitRepository: IUnitRepository,
		) {
			return new RemoveUnitHandler(sectionRepository, unitRepository);
		},
		inject: [PostgresSectionRepository, PostgresUnitRepository],
	},
	{
		provide: DiToken.ADD_UNIT_HANDLER,
		useFactory(
			sectionRepository: ISectionRepository,
			unitRepository: IUnitRepository,
		) {
			return new AddUnitHandler(sectionRepository, unitRepository);
		},
		inject: [PostgresSectionRepository, PostgresUnitRepository],
	},
	{
		provide: DiToken.REORDER_UNIT_HANDLER,
		useFactory(
			sectionRepository: ISectionRepository,
			unitRepository: IUnitRepository,
		) {
			return new ReorderUnitHandler(sectionRepository, unitRepository);
		},
		inject: [PostgresSectionRepository, PostgresUnitRepository],
	},
];
