import type { Provider } from '@nestjs/common';
import {
	AddQuestionHandler,
	CompleteActivityHandler,
	RemoveActivityHandler,
	RemoveActivityProgressHandler,
	RemoveQuestionHandler,
	ReorderQuestionHandler,
	UpdateArticleHandler,
	UpdateExerciseHandler,
	UpdateQuestionHandler,
} from '@/app/activities/commands';
import {
	FindActivityByIdHandler,
	FindActivityProgressForUserHandler,
	FindArticleByIdHandler,
	FindExerciseByIdHandler,
	FindQuizByIdHandler,
	ListActivitiesHandler,
	ListActivityProgressHandler,
	ListArticlesHandler,
	ListExercisesHandler,
	ListQuizzesHandler,
} from '@/app/activities/queries';
import type { IEventBus } from '@/app/common';
import {
	AddArticleHandler,
	AddExerciseHandler,
	AddQuizHandler,
	ReorderActivityHandler,
} from '@/app/lessons/commands';
import type {
	IActivityProgressRepository,
	IActivityRepository,
} from '@/domain/activities';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { InMemoryEventBus } from '@infra/common';
import { DiToken } from '@infra/common';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { PostgresActivityRepository } from './postgres.repository';
import { PostgresActivityProgressRepository } from './postgres-progress.repository';

export const activityHandlersProvider: Provider[] = [
	// ──────────────────────────────────────────────
	// Queries
	// ──────────────────────────────────────────────
	{
		provide: DiToken.LIST_ACTIVITIES_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new ListActivitiesHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.LIST_ARTICLES_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new ListArticlesHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.LIST_EXERCISES_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new ListExercisesHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.LIST_QUIZZES_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new ListQuizzesHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.FIND_ACTIVITY_BY_ID_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new FindActivityByIdHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.FIND_ARTICLE_BY_ID_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new FindArticleByIdHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_BY_ID_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new FindExerciseByIdHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.FIND_QUIZ_BY_ID_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new FindQuizByIdHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},

	// ──────────────────────────────────────────────
	// Commands
	// ──────────────────────────────────────────────
	{
		provide: DiToken.UPDATE_ARTICLE_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new UpdateArticleHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.UPDATE_EXERCISE_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new UpdateExerciseHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.REMOVE_ACTIVITY_HANDLER,
		useFactory(
			activityRepository: IActivityRepository,
			lessonRepository: ILessonRepository,
		) {
			return new RemoveActivityHandler(activityRepository, lessonRepository);
		},
		inject: [PostgresActivityRepository, PostgresLessonRepository],
	},
	{
		provide: DiToken.ADD_QUESTION_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new AddQuestionHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.UPDATE_QUESTION_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new UpdateQuestionHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.REMOVE_QUESTION_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new RemoveQuestionHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.REORDER_QUESTION_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new ReorderQuestionHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.ADD_ARTICLE_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			activityRepository: IActivityRepository,
		) {
			return new AddArticleHandler(lessonRepository, activityRepository);
		},
		inject: [PostgresLessonRepository, PostgresActivityRepository],
	},
	{
		provide: DiToken.ADD_EXERCISE_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			activityRepository: IActivityRepository,
		) {
			return new AddExerciseHandler(lessonRepository, activityRepository);
		},
		inject: [PostgresLessonRepository, PostgresActivityRepository],
	},
	{
		provide: DiToken.ADD_QUIZ_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			activityRepository: IActivityRepository,
		) {
			return new AddQuizHandler(lessonRepository, activityRepository);
		},
		inject: [PostgresLessonRepository, PostgresActivityRepository],
	},
	{
		provide: DiToken.REORDER_ACTIVITY_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			activityRepository: IActivityRepository,
		) {
			return new ReorderActivityHandler(lessonRepository, activityRepository);
		},
		inject: [PostgresLessonRepository, PostgresActivityRepository],
	},
	{
		provide: DiToken.COMPLETE_ACTIVITY_HANDLER,
		useFactory(
			activityProgressRepository: IActivityProgressRepository,
			activityRepository: IActivityRepository,
			eventBus: IEventBus,
		) {
			return new CompleteActivityHandler(
				activityProgressRepository,
				activityRepository,
				eventBus,
			);
		},
		inject: [
			PostgresActivityProgressRepository,
			PostgresActivityRepository,
			InMemoryEventBus,
		],
	},
	{
		provide: DiToken.REMOVE_ACTIVITY_PROGRESS_HANDLER,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new RemoveActivityProgressHandler(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	{
		provide: DiToken.LIST_ACTIVITY_PROGRESS_HANDLER,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new ListActivityProgressHandler(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
	{
		provide: DiToken.FIND_ACTIVITY_PROGRESS_FOR_USER_HANDLER,
		useFactory(activityProgressRepository: IActivityProgressRepository) {
			return new FindActivityProgressForUserHandler(activityProgressRepository);
		},
		inject: [PostgresActivityProgressRepository],
	},
];
