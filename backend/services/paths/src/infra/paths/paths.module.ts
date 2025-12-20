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
import { GrpcPathsController } from './grpc.controller';
import { PostgresPathsRepository } from './postgres.repository';

@Module({
	imports: [DbModule],
	controllers: [GrpcPathsController],
	providers: [
		PostgresPathsRepository,
		{
			provide: DiToken.FIND_PATHS_USE_CASE,
			useFactory(repository: PostgresPathsRepository) {
				return new FindPathsUseCase(repository);
			},
			inject: [PostgresPathsRepository],
		},
		{
			provide: DiToken.FIND_ONE_PATH_USE_CASE,
			useFactory(repository: PostgresPathsRepository) {
				return new FindOnePathUseCase(repository);
			},
			inject: [PostgresPathsRepository],
		},
		{
			provide: DiToken.CREATE_PATH_USE_CASE,
			useFactory(repository: PostgresPathsRepository) {
				return new CreatePathUseCase(repository);
			},
			inject: [PostgresPathsRepository],
		},
		{
			provide: DiToken.UPDATE_PATH_USE_CASE,
			useFactory(repository: PostgresPathsRepository) {
				return new UpdatePathUseCase(repository);
			},
			inject: [PostgresPathsRepository],
		},
		{
			provide: DiToken.REMOVE_PATH_USE_CASE,
			useFactory(repository: PostgresPathsRepository) {
				return new RemovePathUseCase(repository);
			},
			inject: [PostgresPathsRepository],
		},
	],
})
export class PathsModule { }
