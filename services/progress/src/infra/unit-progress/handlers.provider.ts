import type { Provider } from '@nestjs/common';
import { DiToken, InMemoryEventBus, LearningPathsService } from '../common';
import {
	FindUnitProgressByIdHandler,
	FindUnitProgressForUserHandler,
	ListUnitProgressHandler,
} from '@/app/unit-progress/queries';
import {
	RemoveUnitProgressHandler,
	StartUnitHandler,
} from '@/app/unit-progress/commands';
import { PostgresUnitProgressRepository } from './postgres.repository';
import { PostgresUnitProgressReadRepository } from './postgres-read.repository';
import { PostgresSectionProgressReadRepository } from '../section-progress/postgres-read.repository';

export const unitProgressHandlersProvider: Provider[] = [
	{
		provide: DiToken.START_UNIT_HANDLER,
		useFactory(
			unitProgressRepository: PostgresUnitProgressRepository,
			sectionProgressReadRepository: PostgresSectionProgressReadRepository,
			learningPathsService: LearningPathsService,
			eventBus: InMemoryEventBus,
		) {
			return new StartUnitHandler(
				unitProgressRepository,
				sectionProgressReadRepository,
				learningPathsService,
				eventBus,
			);
		},
		inject: [
			PostgresUnitProgressRepository,
			PostgresSectionProgressReadRepository,
			LearningPathsService,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_UNIT_PROGRESS_HANDLER,
		useFactory(unitProgressRepository: PostgresUnitProgressRepository) {
			return new RemoveUnitProgressHandler(unitProgressRepository);
		},
		inject: [PostgresUnitProgressRepository],
	},
	{
		provide: DiToken.LIST_UNIT_PROGRESS_HANDLER,
		useFactory(unitProgressReadRepository: PostgresUnitProgressReadRepository) {
			return new ListUnitProgressHandler(unitProgressReadRepository);
		},
		inject: [PostgresUnitProgressReadRepository],
	},
	{
		provide: DiToken.FIND_UNIT_PROGRESS_BY_ID_HANDLER,
		useFactory(unitProgressReadRepository: PostgresUnitProgressReadRepository) {
			return new FindUnitProgressByIdHandler(unitProgressReadRepository);
		},
		inject: [PostgresUnitProgressReadRepository],
	},
	{
		provide: DiToken.FIND_UNIT_PROGRESS_FOR_USER_HANDLER,
		useFactory(unitProgressReadRepository: PostgresUnitProgressReadRepository) {
			return new FindUnitProgressForUserHandler(unitProgressReadRepository);
		},
		inject: [PostgresUnitProgressReadRepository],
	},
];
