import { Provider } from '@nestjs/common';
import {
	CreateSectionUseCase,
	FindOneSectionUseCase,
	FindSectionsUseCase,
	RemoveSectionUseCase,
	UpdateSectionUseCase,
} from '@/app/sections/use-cases';
import { DiToken } from '../common/enums';
import { PostgresPathsRepository } from '../paths/postgres.repository';
import { PostgresSectionsRepository } from './postgres.repository';

export const sectionsUseCasesProvider: Provider[] = [
	{
		provide: DiToken.FIND_SECTIONS_USE_CASE,
		useFactory(sectionsRepository: PostgresSectionsRepository) {
			return new FindSectionsUseCase(sectionsRepository);
		},
		inject: [PostgresSectionsRepository],
	},
	{
		provide: DiToken.FIND_ONE_SECTION_USE_CASE,
		useFactory(sectionsRepository: PostgresSectionsRepository) {
			return new FindOneSectionUseCase(sectionsRepository);
		},
		inject: [PostgresSectionsRepository],
	},
	{
		provide: DiToken.CREATE_SECTION_USE_CASE,
		useFactory(
			sectionsRepository: PostgresSectionsRepository,
			pathsRepository: PostgresPathsRepository,
		) {
			return new CreateSectionUseCase(sectionsRepository, pathsRepository);
		},
		inject: [PostgresSectionsRepository, PostgresPathsRepository],
	},
	{
		provide: DiToken.UPDATE_SECTION_USE_CASE,
		useFactory(sectionsRepository: PostgresSectionsRepository) {
			return new UpdateSectionUseCase(sectionsRepository);
		},
		inject: [PostgresSectionsRepository, PostgresPathsRepository],
	},
	{
		provide: DiToken.REMOVE_SECTION_USE_CASE,
		useFactory(sectionsSepository: PostgresSectionsRepository) {
			return new RemoveSectionUseCase(sectionsSepository);
		},
		inject: [PostgresSectionsRepository],
	},
];
