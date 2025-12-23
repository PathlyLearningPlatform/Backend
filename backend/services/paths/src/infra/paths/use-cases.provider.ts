import { Provider } from '@nestjs/common';
import {
	CreatePathUseCase,
	FindOnePathUseCase,
	FindPathsUseCase,
	RemovePathUseCase,
	UpdatePathUseCase,
} from '@/app/paths/use-cases';
import { DiToken } from '../common/enums';
import { PostgresPathsRepository } from './postgres.repository';
import { IPathsRepository } from '@/app/paths/interfaces';

export const pathsUseCasesProvider: Provider[] = [
	{
		provide: DiToken.FIND_PATHS_USE_CASE,
		useFactory(pathsRepository: IPathsRepository) {
			return new FindPathsUseCase(pathsRepository);
		},
		inject: [PostgresPathsRepository],
	},
	{
		provide: DiToken.FIND_ONE_PATH_USE_CASE,
		useFactory(pathsRepository: IPathsRepository) {
			return new FindOnePathUseCase(pathsRepository);
		},
		inject: [PostgresPathsRepository],
	},
	{
		provide: DiToken.CREATE_PATH_USE_CASE,
		useFactory(pathsRepository: IPathsRepository) {
			return new CreatePathUseCase(pathsRepository);
		},
		inject: [PostgresPathsRepository],
	},
	{
		provide: DiToken.UPDATE_PATH_USE_CASE,
		useFactory(pathsRepository: IPathsRepository) {
			return new UpdatePathUseCase(pathsRepository);
		},
		inject: [PostgresPathsRepository],
	},
	{
		provide: DiToken.REMOVE_PATH_USE_CASE,
		useFactory(pathsRepository: IPathsRepository) {
			return new RemovePathUseCase(pathsRepository);
		},
		inject: [PostgresPathsRepository],
	},
];
