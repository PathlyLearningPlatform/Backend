import { Provider } from '@nestjs/common';
import {
	CreateSectionUseCase,
	FindOneSectionUseCase,
	FindSectionsUseCase,
	RemoveSectionUseCase,
	UpdateSectionUseCase,
} from '@/app/sections/use-cases';
import { DiToken } from '../common/enums';
import { PostgresLearningPathsRepository } from '../learning-paths/postgres.repository';
import { PostgresSectionsRepository } from './postgres.repository';
import { ISectionsRepository } from '@/app/sections/interfaces';
import { ILearningPathsRepository } from '@/app/learning-paths/interfaces';

export const sectionsUseCasesProvider: Provider[] = [
	{
		provide: DiToken.FIND_SECTIONS_USE_CASE,
		useFactory(sectionsRepository: ISectionsRepository) {
			return new FindSectionsUseCase(sectionsRepository);
		},
		inject: [PostgresSectionsRepository],
	},
	{
		provide: DiToken.FIND_ONE_SECTION_USE_CASE,
		useFactory(sectionsRepository: ISectionsRepository) {
			return new FindOneSectionUseCase(sectionsRepository);
		},
		inject: [PostgresSectionsRepository],
	},
	{
		provide: DiToken.CREATE_SECTION_USE_CASE,
		useFactory(
			sectionsRepository: ISectionsRepository,
			pathsRepository: ILearningPathsRepository,
		) {
			return new CreateSectionUseCase(sectionsRepository, pathsRepository);
		},
		inject: [PostgresSectionsRepository, PostgresLearningPathsRepository],
	},
	{
		provide: DiToken.UPDATE_SECTION_USE_CASE,
		useFactory(sectionsRepository: ISectionsRepository) {
			return new UpdateSectionUseCase(sectionsRepository);
		},
		inject: [PostgresSectionsRepository],
	},
	{
		provide: DiToken.REMOVE_SECTION_USE_CASE,
		useFactory(sectionsSepository: ISectionsRepository) {
			return new RemoveSectionUseCase(sectionsSepository);
		},
		inject: [PostgresSectionsRepository],
	},
];
