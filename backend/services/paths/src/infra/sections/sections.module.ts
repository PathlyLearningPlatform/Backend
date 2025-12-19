import { Module } from '@nestjs/common';
import {
	CreateSectionUseCase,
	FindOneSectionUseCase,
	FindSectionsUseCase,
	RemoveSectionUseCase,
	UpdateSectionUseCase,
} from '@/app/sections/use-cases';
import { DiToken } from '../common/enums';
import { DbModule } from '../db/db.module';
import { SectionsController } from './sections.controller';
import { SectionsRepository } from './sections.repository';

@Module({
	imports: [DbModule],
	controllers: [SectionsController],
	providers: [
		SectionsRepository,
		{
			provide: DiToken.FIND_PATHS_USE_CASE,
			useFactory(repository: SectionsRepository) {
				return new FindSectionsUseCase(repository);
			},
			inject: [SectionsRepository],
		},
		{
			provide: DiToken.FIND_ONE_PATH_USE_CASE,
			useFactory(repository: SectionsRepository) {
				return new FindOneSectionUseCase(repository);
			},
			inject: [SectionsRepository],
		},
		{
			provide: DiToken.CREATE_PATH_USE_CASE,
			useFactory(repository: SectionsRepository) {
				return new CreateSectionUseCase(repository);
			},
			inject: [SectionsRepository],
		},
		{
			provide: DiToken.UPDATE_PATH_USE_CASE,
			useFactory(repository: SectionsRepository) {
				return new UpdateSectionUseCase(repository);
			},
			inject: [SectionsRepository],
		},
		{
			provide: DiToken.REMOVE_PATH_USE_CASE,
			useFactory(repository: SectionsRepository) {
				return new RemoveSectionUseCase(repository);
			},
			inject: [SectionsRepository],
		},
	],
})
export class SectionsModule {}
