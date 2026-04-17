import type { Provider } from '@nestjs/common';
import type { IEventBus } from '@/app/common';
import { AddUnitHandler, ReorderUnitHandler } from '@/app/sections/commands';
import {
	RemoveUnitHandler,
	RemoveUnitProgressHandler,
	StartUnitHandler,
	UpdateUnitHandler,
} from '@/app/units/commands';
import {
	FindUnitByIdHandler,
	FindUnitProgressForUserHandler,
	ListUnitProgressHandler,
	ListUnitsHandler,
} from '@/app/units/queries';
import type { ISectionRepository } from '@/domain/sections/repositories';
import type { IUnitProgressRepository, IUnitRepository } from '@/domain/units';
import { InMemoryEventBus } from '@infra/common';
import { DiToken } from '@infra/common';
import { PostgresSectionRepository } from '../sections/postgres.repository';
import { PostgresUnitRepository } from './postgres.repository';
import { PostgresUnitProgressRepository } from './postgres-progress.repository';
import { PostgresSectionProgressRepository } from '../sections/postgres-progress.repository';
import { ISectionProgressRepository } from '@/domain/sections/repositories';
import { OnUnitCompletedHandler } from '@/app/units/events';

export const unitHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_UNITS_HANDLER,
		useFactory(unitRepository: IUnitRepository) {
			return new ListUnitsHandler(unitRepository);
		},
		inject: [PostgresUnitRepository],
	},
	{
		provide: DiToken.FIND_UNIT_BY_ID_HANDLER,
		useFactory(unitRepository: IUnitRepository) {
			return new FindUnitByIdHandler(unitRepository);
		},
		inject: [PostgresUnitRepository],
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
			unitRepository: IUnitRepository,
			sectionProgressRepository: ISectionProgressRepository,
			eventBus: IEventBus,
		) {
			return new StartUnitHandler(
				unitProgressRepository,
				unitRepository,
				sectionProgressRepository,
				eventBus,
			);
		},
		inject: [
			PostgresUnitProgressRepository,
			PostgresUnitRepository,
			PostgresSectionProgressRepository,
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
		useFactory(unitProgressRepository: IUnitProgressRepository) {
			return new ListUnitProgressHandler(unitProgressRepository);
		},
		inject: [PostgresUnitProgressRepository],
	},
	{
		provide: DiToken.FIND_UNIT_PROGRESS_FOR_USER_HANDLER,
		useFactory(unitProgressRepository: IUnitProgressRepository) {
			return new FindUnitProgressForUserHandler(unitProgressRepository);
		},
		inject: [PostgresUnitProgressRepository],
	},
	{
		provide: DiToken.ON_UNIT_COMPLETED_HANDLER,
		useFactory(
			sectionProgressRepository: PostgresSectionProgressRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnUnitCompletedHandler(sectionProgressRepository, eventBus);
		},
		inject: [PostgresSectionProgressRepository, InMemoryEventBus],
	},
];
