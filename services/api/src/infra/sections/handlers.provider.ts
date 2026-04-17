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
import {
	FindSectionByIdHandler,
	FindSectionProgressForUserHandler,
	ListSectionProgressHandler,
	ListSectionsHandler,
} from '@/app/sections/queries';
import type { ILearningPathRepository } from '@/domain/learning-paths';
import type {
	ISectionProgressRepository,
	ISectionRepository,
} from '@/domain/sections';
import { InMemoryEventBus } from '@infra/common';
import { DiToken } from '@infra/common';
import { PostgresLearningPathRepository } from '../learning-paths/postgres.repository';
import { PostgresSectionRepository } from './postgres.repository';
import { PostgresSectionProgressRepository } from './postgres-progress.repository';
import { PostgresLearningPathProgressRepository } from '../learning-paths/postgres-progress.repository';
import { ILearningPathProgressRepository } from '@/domain/learning-paths';
import { OnSectionCompletedHandler } from '@/app/sections/events';

export const sectionHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_SECTIONS_HANDLER,
		useFactory(sectionRepository: ISectionRepository) {
			return new ListSectionsHandler(sectionRepository);
		},
		inject: [PostgresSectionRepository],
	},
	{
		provide: DiToken.FIND_SECTION_BY_ID_HANDLER,
		useFactory(sectionRepository: ISectionRepository) {
			return new FindSectionByIdHandler(sectionRepository);
		},
		inject: [PostgresSectionRepository],
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
			sectionRepository: ISectionRepository,
			learningPathProgressRepository: ILearningPathProgressRepository,
			eventBus: IEventBus,
		) {
			return new StartSectionHandler(
				sectionProgressRepository,
				sectionRepository,
				learningPathProgressRepository,
				eventBus,
			);
		},
		inject: [
			PostgresSectionProgressRepository,
			PostgresSectionRepository,
			PostgresLearningPathProgressRepository,
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
		useFactory(sectionProgressRepository: ISectionProgressRepository) {
			return new ListSectionProgressHandler(sectionProgressRepository);
		},
		inject: [PostgresSectionProgressRepository],
	},
	{
		provide: DiToken.FIND_SECTION_PROGRESS_FOR_USER_HANDLER,
		useFactory(sectionProgressRepository: ISectionProgressRepository) {
			return new FindSectionProgressForUserHandler(sectionProgressRepository);
		},
		inject: [PostgresSectionProgressRepository],
	},
	{
		provide: DiToken.ON_SECTION_COMPLETED_HANDLER,
		useFactory(
			learningPathProgressRepository: PostgresLearningPathProgressRepository,
			eventBus: InMemoryEventBus,
		) {
			return new OnSectionCompletedHandler(
				learningPathProgressRepository,
				eventBus,
			);
		},
		inject: [PostgresLearningPathProgressRepository, InMemoryEventBus],
	},
];
