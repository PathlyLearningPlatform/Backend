import { Provider } from '@nestjs/common';
import { DiToken } from '../common/enums';
import { PostgresLessonProgressRepository } from './postgres.repository';
import { ILessonProgressRepository } from '@/app/lesson-progress/interfaces';
import {
	FindLessonProgressByIdUseCase,
	FindOneLessonProgressForUserUseCase,
	ListLessonProgressUseCase,
	RemoveLessonProgressByIdUseCase,
	StartLessonUseCase,
} from '@/app/lesson-progress/use-cases';
import { ILearningPathsService } from '@/app/common/interfaces';
import { LearningPathsService } from '@/infra/common/modules/learning-paths/learning-paths.service';

export const lessonProgressUseCasesProvider: Provider[] = [
	{
		provide: DiToken.START_LESSON_USE_CASE,
		useFactory(
			lessonProgressRepository: ILessonProgressRepository,
			learningPathsService: ILearningPathsService,
		) {
			return new StartLessonUseCase(
				lessonProgressRepository,
				learningPathsService,
			);
		},
		inject: [PostgresLessonProgressRepository, LearningPathsService],
	},
	{
		provide: DiToken.FIND_LESSON_PROGRESS_BY_ID_USE_CASE,
		useFactory(lessonProgressRepository: ILessonProgressRepository) {
			return new FindLessonProgressByIdUseCase(lessonProgressRepository);
		},
		inject: [PostgresLessonProgressRepository],
	},
	{
		provide: DiToken.FIND_ONE_LESSON_PROGRESS_FOR_USER_USE_CASE,
		useFactory(lessonProgressRepository: ILessonProgressRepository) {
			return new FindOneLessonProgressForUserUseCase(lessonProgressRepository);
		},
		inject: [PostgresLessonProgressRepository],
	},
	{
		provide: DiToken.LIST_LESSON_PROGRESS_USE_CASE,
		useFactory(lessonProgressRepository: ILessonProgressRepository) {
			return new ListLessonProgressUseCase(lessonProgressRepository);
		},
		inject: [PostgresLessonProgressRepository],
	},
	{
		provide: DiToken.REMOVE_LESSON_PROGRESS_BY_ID_USE_CASE,
		useFactory(lessonProgressRepository: ILessonProgressRepository) {
			return new RemoveLessonProgressByIdUseCase(lessonProgressRepository);
		},
		inject: [PostgresLessonProgressRepository],
	},
];
