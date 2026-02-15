import type { Provider } from '@nestjs/common';
import {
	CreateArticleUseCase,
	CreateExerciseUseCase,
	CreateQuestionUseCase,
	CreateQuizUseCase,
	FindActivitiesUseCase,
	FindOneActivityUseCase,
	FindOneArticleUseCase,
	FindOneExerciseUseCase,
	FindOneQuestionUseCase,
	FindOneQuizUseCase,
	FindQuestionsUseCase,
	RemoveActivityUseCase,
	RemoveQuestionUseCase,
	UpdateArticleUseCase,
	UpdateExerciseUseCase,
	UpdateQuestionUseCase,
	UpdateQuizUseCase,
} from '@/app/activities/use-cases';
import { DiToken } from '../common/enums';
import { PostgresActivitiesRepository } from './postgres.repository';
import { ILessonsRepository } from '@/domain/lessons/interfaces';
import { PostgresLessonsRepository } from '../lessons/postgres.repository';
import { IActivitiesRepository } from '@/domain/activities/interfaces';

export const activitiesUseCasesProvider: Provider[] = [
	{
		provide: DiToken.FIND_ACTIVITIES_USE_CASE,
		useFactory: (activitiesRepository: IActivitiesRepository) =>
			new FindActivitiesUseCase(activitiesRepository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_ONE_ACTIVITY_USE_CASE,
		useFactory: (activitiesRepository: IActivitiesRepository) =>
			new FindOneActivityUseCase(activitiesRepository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_ONE_ARTICLE_USE_CASE,
		useFactory: (activitiesRepository: IActivitiesRepository) =>
			new FindOneArticleUseCase(activitiesRepository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_ONE_EXERCISE_USE_CASE,
		useFactory: (activitiesRepository: IActivitiesRepository) =>
			new FindOneExerciseUseCase(activitiesRepository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_ONE_QUIZ_USE_CASE,
		useFactory: (activitiesRepository: IActivitiesRepository) =>
			new FindOneQuizUseCase(activitiesRepository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.CREATE_ARTICLE_USE_CASE,
		useFactory: (
			activitiesRepository: IActivitiesRepository,
			lessonsRepository: ILessonsRepository,
		) => new CreateArticleUseCase(activitiesRepository, lessonsRepository),
		inject: [PostgresActivitiesRepository, PostgresLessonsRepository],
	},
	{
		provide: DiToken.CREATE_EXERCISE_USE_CASE,
		useFactory: (
			activitiesRepository: IActivitiesRepository,
			lessonsRepository: ILessonsRepository,
		) => new CreateExerciseUseCase(activitiesRepository, lessonsRepository),
		inject: [PostgresActivitiesRepository, PostgresLessonsRepository],
	},
	{
		provide: DiToken.CREATE_QUIZ_USE_CASE,
		useFactory: (
			activitiesRepository: IActivitiesRepository,
			lessonsRepository: ILessonsRepository,
		) => new CreateQuizUseCase(activitiesRepository, lessonsRepository),
		inject: [PostgresActivitiesRepository, PostgresLessonsRepository],
	},
	{
		provide: DiToken.UPDATE_ARTICLE_USE_CASE,
		useFactory: (
			activitiesRepository: IActivitiesRepository,
			lessonsRepository: ILessonsRepository,
		) => new UpdateArticleUseCase(activitiesRepository, lessonsRepository),
		inject: [PostgresActivitiesRepository, PostgresLessonsRepository],
	},
	{
		provide: DiToken.UPDATE_EXERCISE_USE_CASE,
		useFactory: (
			activitiesRepository: IActivitiesRepository,
			lessonsRepository: ILessonsRepository,
		) => new UpdateExerciseUseCase(activitiesRepository, lessonsRepository),
		inject: [PostgresActivitiesRepository, PostgresLessonsRepository],
	},
	{
		provide: DiToken.UPDATE_QUIZ_USE_CASE,
		useFactory: (
			activitiesRepository: IActivitiesRepository,
			lessonsRepository: ILessonsRepository,
		) => new UpdateQuizUseCase(activitiesRepository, lessonsRepository),
		inject: [PostgresActivitiesRepository, PostgresLessonsRepository],
	},
	{
		provide: DiToken.REMOVE_ACTIVITY_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new RemoveActivityUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_QUESTIONS_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new FindQuestionsUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.FIND_ONE_QUESTION_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new FindOneQuestionUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.CREATE_QUESTION_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new CreateQuestionUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.UPDATE_QUESTION_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new UpdateQuestionUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
	{
		provide: DiToken.REMOVE_QUESTION_USE_CASE,
		useFactory: (repository: PostgresActivitiesRepository) =>
			new RemoveQuestionUseCase(repository),
		inject: [PostgresActivitiesRepository],
	},
];
