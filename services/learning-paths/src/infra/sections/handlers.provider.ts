import type { Provider } from '@nestjs/common';
import type { ILearningPathRepository } from '@/domain/learning-paths/interfaces';
import type { ISectionRepository } from '@/domain/sections/interfaces';
import type { ISectionReadRepository } from '@/app/sections/interfaces';
import type { IUnitRepository } from '@/domain/units/interfaces';
import { DiToken } from '../common/enums';
import { PostgresLearningPathRepository } from '../learning-paths/postgres.repository';
import { PostgresSectionRepository } from './postgres.repository';
import { PostgresSectionReadRepository } from './postgres-read.repository';
import { PostgresUnitRepository } from '../units/postgres.repository';
import {
	ListSectionsHandler,
	FindSectionByIdHandler,
} from '@/app/sections/queries';
import {
	UpdateSectionHandler,
	RemoveSectionHandler,
	AddUnitHandler,
	ReorderUnitHandler,
} from '@/app/sections/commands';
import {
	AddSectionHandler,
	ReorderSectionHandler,
} from '@/app/learning-paths/commands';

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
];
