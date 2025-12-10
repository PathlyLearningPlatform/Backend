import { Module } from '@nestjs/common';
import {
	CreatePathUseCase,
	FindOnePathUseCase,
	FindPathsUseCase,
	RemovePathUseCase,
	UpdatePathUseCase,
} from '@/app/paths/use-cases';
import { DiToken } from '../common/enums';
import { DbModule } from '../db/db.module';
import { PathsController } from './paths.controller';
import { PathsRepository } from './paths.repository';

@Module({
	imports: [DbModule],
	controllers: [PathsController],
	providers: [
		PathsRepository,
		{
			provide: DiToken.FIND_PATHS_USE_CASE,
			useFactory(repository: PathsRepository) {
				return new FindPathsUseCase(repository);
			},
			inject: [PathsRepository],
		},
		{
			provide: DiToken.FIND_ONE_PATH_USE_CASE,
			useFactory(repository: PathsRepository) {
				return new FindOnePathUseCase(repository);
			},
			inject: [PathsRepository],
		},
		{
			provide: DiToken.CREATE_PATH_USE_CASE,
			useFactory(repository: PathsRepository) {
				return new CreatePathUseCase(repository);
			},
			inject: [PathsRepository],
		},
		{
			provide: DiToken.UPDATE_PATH_USE_CASE,
			useFactory(repository: PathsRepository) {
				return new UpdatePathUseCase(repository);
			},
			inject: [PathsRepository],
		},
		{
			provide: DiToken.REMOVE_PATH_USE_CASE,
			useFactory(repository: PathsRepository) {
				return new RemovePathUseCase(repository);
			},
			inject: [PathsRepository],
		},
	],
})
export class PathsModule {}
