import type { Provider } from '@nestjs/common';
import { DiToken, InMemoryEventBus, LearningPathsService } from '../common';
import {
	FindSectionProgressByIdHandler,
	FindSectionProgressForUserHandler,
	ListSectionProgressHandler,
} from '@/app/section-progress/queries';
import {
	RemoveSectionProgressHandler,
	StartSectionHandler,
} from '@/app/section-progress/commands';
import { PostgresSectionProgressRepository } from './postgres.repository';
import { PostgresSectionProgressReadRepository } from './postgres-read.repository';
import { PostgresLearningPathProgressReadRepository } from '../learning-path-progress/postgres-read.repository';

export const sectionProgressHandlersProvider: Provider[] = [
	{
		provide: DiToken.START_SECTION_HANDLER,
		useFactory(
			sectionProgressRepository: PostgresSectionProgressRepository,
			learningPathProgressReadRepository: PostgresLearningPathProgressReadRepository,
			learningPathsService: LearningPathsService,
			eventBus: InMemoryEventBus,
		) {
			return new StartSectionHandler(
				sectionProgressRepository,
				learningPathProgressReadRepository,
				learningPathsService,
				eventBus,
			);
		},
		inject: [
			PostgresSectionProgressRepository,
			PostgresLearningPathProgressReadRepository,
			LearningPathsService,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_SECTION_PROGRESS_HANDLER,
		useFactory(sectionProgressRepository: PostgresSectionProgressRepository) {
			return new RemoveSectionProgressHandler(sectionProgressRepository);
		},
		inject: [PostgresSectionProgressRepository],
	},
	{
		provide: DiToken.LIST_SECTION_PROGRESS_HANDLER,
		useFactory(
			sectionProgressReadRepository: PostgresSectionProgressReadRepository,
		) {
			return new ListSectionProgressHandler(sectionProgressReadRepository);
		},
		inject: [PostgresSectionProgressReadRepository],
	},
	{
		provide: DiToken.FIND_SECTION_PROGRESS_BY_ID_HANDLER,
		useFactory(
			sectionProgressReadRepository: PostgresSectionProgressReadRepository,
		) {
			return new FindSectionProgressByIdHandler(sectionProgressReadRepository);
		},
		inject: [PostgresSectionProgressReadRepository],
	},
	{
		provide: DiToken.FIND_SECTION_PROGRESS_FOR_USER_HANDLER,
		useFactory(
			sectionProgressReadRepository: PostgresSectionProgressReadRepository,
		) {
			return new FindSectionProgressForUserHandler(
				sectionProgressReadRepository,
			);
		},
		inject: [PostgresSectionProgressReadRepository],
	},
];
