import type { Provider } from '@nestjs/common';
import type { IEventBus } from '@/app/common';
import { AddUnitHandler, ReorderUnitHandler } from '@/app/sections/commands';
import {
	RemoveUnitHandler,
	RemoveUnitProgressHandler,
	StartUnitHandler,
	UpdateUnitHandler,
} from '@/app/units/commands';
import type {
	IUnitProgressReadRepository,
	IUnitReadRepository,
} from '@/app/units/interfaces';
import {
	FindUnitByIdHandler,
	FindUnitProgressForUserHandler,
	ListUnitProgressHandler,
	ListUnitsHandler,
} from '@/app/units/queries';
import type { ISectionRepository } from '@/domain/sections/repositories';
import type { IUnitProgressRepository } from '@/domain/units';
import type { IUnitRepository } from '@/domain/units/repositories';
import { InMemoryEventBus } from '../common/adapters';
import { DiToken } from '../common/enums';
import { PostgresSectionRepository } from '../sections/postgres.repository';
import { PostgresUnitRepository } from './postgres.repository';
import { PostgresUnitProgressRepository } from './postgres-progress.repository';
import { PostgresUnitProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresUnitReadRepository } from './postgres-read.repository';

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
	{
		provide: DiToken.START_UNIT_HANDLER,
		useFactory(
			unitProgressRepository: IUnitProgressRepository,
			unitReadRepository: IUnitReadRepository,
			eventBus: IEventBus,
		) {
			return new StartUnitHandler(
				unitProgressRepository,
				unitReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresUnitProgressRepository,
			PostgresUnitReadRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_UNIT_PROGRESS_HANDLER,
		useFactory(unitProgressRepository: IUnitProgressRepository) {
			return new RemoveUnitProgressHandler(unitProgressRepository);
		},
		inject: [PostgresUnitProgressRepository],
	},
	{
		provide: DiToken.LIST_UNIT_PROGRESS_HANDLER,
		useFactory(unitProgressReadRepository: IUnitProgressReadRepository) {
			return new ListUnitProgressHandler(unitProgressReadRepository);
		},
		inject: [PostgresUnitProgressReadRepository],
	},
	{
		provide: DiToken.FIND_UNIT_PROGRESS_FOR_USER_HANDLER,
		useFactory(unitProgressReadRepository: IUnitProgressReadRepository) {
			return new FindUnitProgressForUserHandler(unitProgressReadRepository);
		},
		inject: [PostgresUnitProgressReadRepository],
	},
];
