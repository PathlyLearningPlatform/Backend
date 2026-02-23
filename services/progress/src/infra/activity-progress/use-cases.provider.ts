import { Provider } from '@nestjs/common';
import { DiToken } from '../common/enums';
import { PostgresActivityProgressRepository } from './postgres.repository';
import { IActivityProgressRepository } from '@/app/activity-progress/interfaces';
import {
	CompleteActivityUseCase,
	FindActivityProgressByIdUseCase,
	FindOneActivityProgressUseCase,
	ListActivityProgressUseCase,
	RemoveActivityProgressByIdUseCase,
	StartActivityUseCase,
} from '@/app/activity-progress/use-cases';
import { ILearningPathsService } from '@/app/interfaces';
import { LearningPathsService } from '../services';

export const activityProgressUseCasesProvider: Provider[] = [
	{
		provide: DiToken.COMPLETE_ACTIVITY_USE_CASE,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new CompleteActivityUseCase(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	{
		provide: DiToken.START_ACTIVITY_USE_CASE,
		useFactory(
			activityProgressRepository: IActivityProgressRepository,
			learningPathsService: ILearningPathsService,
		) {
			return new StartActivityUseCase(
				activityProgressRepository,
				learningPathsService,
			);
		},
		inject: [PostgresActivityProgressRepository, LearningPathsService],
	},
	{
		provide: DiToken.FIND_ACTIVITY_PROGRESS_BY_ID_USE_CASE,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new FindActivityProgressByIdUseCase(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	{
		provide: DiToken.FIND_ONE_ACTIVITY_PROGRESS_USE_CASE,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new FindOneActivityProgressUseCase(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	{
		provide: DiToken.LIST_ACTIVITY_PROGRESS_USE_CASE,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new ListActivityProgressUseCase(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	{
		provide: DiToken.REMOVE_ACTIVITY_PROGRESS_BY_ID_USE_CASE,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new RemoveActivityProgressByIdUseCase(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
];
