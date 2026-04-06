import type { Provider } from '@nestjs/common';
import type { IEventBus } from '@/app/common';
import {
	AddSectionHandler,
	ReorderSectionHandler,
} from '@/app/learning-paths/commands';
import {
	RemoveSectionHandler,
	RemoveSectionProgressHandler,
	StartSectionHandler,
	UpdateSectionHandler,
} from '@/app/sections/commands';
import type {
	ISectionProgressReadRepository,
	ISectionReadRepository,
} from '@/app/sections/interfaces';
import {
	FindSectionByIdHandler,
	FindSectionProgressForUserHandler,
	ListSectionProgressHandler,
	ListSectionsHandler,
} from '@/app/sections/queries';
import type { ILearningPathRepository } from '@/domain/learning-paths';
import type { ISectionProgressRepository } from '@/domain/sections';
import type { ISectionRepository } from '@/domain/sections/repositories';
import { InMemoryEventBus } from '../common/adapters';
import { DiToken } from '../common/enums';
import { PostgresLearningPathRepository } from '../learning-paths/postgres.repository';
import { PostgresSectionRepository } from './postgres.repository';
import { PostgresSectionProgressRepository } from './postgres-progress.repository';
import { PostgresSectionProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresSectionReadRepository } from './postgres-read.repository';

export const sectionHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_SECTIONS_HANDLER,
		useFactory(sectionReadRepository: ISectionReadRepository) {
			return new ListSectionsHandler(sectionReadRepository);
		},
		inject: [PostgresSectionReadRepository],
	},
	{
		provide: DiToken.FIND_SECTION_BY_ID_HANDLER,
		useFactory(sectionReadRepository: ISectionReadRepository) {
			return new FindSectionByIdHandler(sectionReadRepository);
		},
		inject: [PostgresSectionReadRepository],
	},
	{
		provide: DiToken.ADD_SECTION_HANDLER,
		useFactory(
			learningPathRepository: ILearningPathRepository,
			sectionRepository: ISectionRepository,
		) {
			return new AddSectionHandler(learningPathRepository, sectionRepository);
		},
		inject: [PostgresLearningPathRepository, PostgresSectionRepository],
	},
	{
		provide: DiToken.UPDATE_SECTION_HANDLER,
		useFactory(sectionRepository: ISectionRepository) {
			return new UpdateSectionHandler(sectionRepository);
		},
		inject: [PostgresSectionRepository],
	},
	{
		provide: DiToken.REORDER_SECTION_HANDLER,
		useFactory(
			learningPathRepository: ILearningPathRepository,
			sectionRepository: ISectionRepository,
		) {
			return new ReorderSectionHandler(
				learningPathRepository,
				sectionRepository,
			);
		},
		inject: [PostgresLearningPathRepository, PostgresSectionRepository],
	},
	{
		provide: DiToken.REMOVE_SECTION_HANDLER,
		useFactory(
			learningPathRepository: ILearningPathRepository,
			sectionRepository: ISectionRepository,
		) {
			return new RemoveSectionHandler(
				learningPathRepository,
				sectionRepository,
			);
		},
		inject: [PostgresLearningPathRepository, PostgresSectionRepository],
	},
	{
		provide: DiToken.START_SECTION_HANDLER,
		useFactory(
			sectionProgressRepository: ISectionProgressRepository,
			sectionReadRepository: ISectionReadRepository,
			eventBus: IEventBus,
		) {
			return new StartSectionHandler(
				sectionProgressRepository,
				sectionReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresSectionProgressRepository,
			PostgresSectionReadRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_SECTION_PROGRESS_HANDLER,
		useFactory(sectionProgressRepository: ISectionProgressRepository) {
			return new RemoveSectionProgressHandler(sectionProgressRepository);
		},
		inject: [PostgresSectionProgressRepository],
	},
	{
		provide: DiToken.LIST_SECTION_PROGRESS_HANDLER,
		useFactory(sectionProgressReadRepository: ISectionProgressReadRepository) {
			return new ListSectionProgressHandler(sectionProgressReadRepository);
		},
		inject: [PostgresSectionProgressReadRepository],
	},
	{
		provide: DiToken.FIND_SECTION_PROGRESS_FOR_USER_HANDLER,
		useFactory(sectionProgressReadRepository: ISectionProgressReadRepository) {
			return new FindSectionProgressForUserHandler(
				sectionProgressReadRepository,
			);
		},
		inject: [PostgresSectionProgressReadRepository],
	},
];
