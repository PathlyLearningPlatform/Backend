import type { Provider } from '@nestjs/common';
import type { IActivityRepository } from '@/domain/activities/interfaces';
import type { IActivityReadRepository } from '@/app/activities/interfaces';
import type { ILessonRepository } from '@/domain/lessons/interfaces';
import { DiToken } from '../common/enums';
import { PostgresActivityRepository } from './postgres.repository';
import { PostgresActivityReadRepository } from './postgres-read.repository';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import {
	ListActivitiesHandler,
	ListArticlesHandler,
	ListExercisesHandler,
	ListQuizzesHandler,
	FindActivityByIdHandler,
	FindArticleByIdHandler,
	FindExerciseByIdHandler,
	FindQuizByIdHandler,
} from '@/app/activities/queries';
import {
	RemoveActivityHandler,
	UpdateArticleHandler,
	UpdateExerciseHandler,
	UpdateQuestionHandler,
	AddQuestionHandler,
	RemoveQuestionHandler,
	ReorderQuestionHandler,
} from '@/app/activities/commands';
import { AddArticleHandler, AddExerciseHandler, AddQuizHandler, ReorderActivityHandler } from '@/app/lessons/commands';

export const activityHandlersProvider: Provider[] = [
	// ──────────────────────────────────────────────
	// Queries
	// ──────────────────────────────────────────────
	{
		provide: DiToken.LIST_ACTIVITIES_HANDLER,
		useFactory(activityReadRepository: IActivityReadRepository) {
			return new ListActivitiesHandler(activityReadRepository);
		},
		inject: [PostgresActivityReadRepository],
	},
	{
		provide: DiToken.LIST_ARTICLES_HANDLER,
		useFactory(activityReadRepository: IActivityReadRepository) {
			return new ListArticlesHandler(activityReadRepository);
		},
		inject: [PostgresActivityReadRepository],
	},
	{
		provide: DiToken.LIST_EXERCISES_HANDLER,
		useFactory(activityReadRepository: IActivityReadRepository) {
			return new ListExercisesHandler(activityReadRepository);
		},
		inject: [PostgresActivityReadRepository],
	},
	{
		provide: DiToken.LIST_QUIZZES_HANDLER,
		useFactory(activityReadRepository: IActivityReadRepository) {
			return new ListQuizzesHandler(activityReadRepository);
		},
		inject: [PostgresActivityReadRepository],
	},
	{
		provide: DiToken.FIND_ACTIVITY_BY_ID_HANDLER,
		useFactory(activityReadRepository: IActivityReadRepository) {
			return new FindActivityByIdHandler(activityReadRepository);
		},
		inject: [PostgresActivityReadRepository],
	},
	{
		provide: DiToken.FIND_ARTICLE_BY_ID_HANDLER,
		useFactory(activityReadRepository: IActivityReadRepository) {
			return new FindArticleByIdHandler(activityReadRepository);
		},
		inject: [PostgresActivityReadRepository],
	},
	{
		provide: DiToken.FIND_EXERCISE_BY_ID_HANDLER,
		useFactory(activityReadRepository: IActivityReadRepository) {
			return new FindExerciseByIdHandler(activityReadRepository);
		},
		inject: [PostgresActivityReadRepository],
	},
	{
		provide: DiToken.FIND_QUIZ_BY_ID_HANDLER,
		useFactory(activityReadRepository: IActivityReadRepository) {
			return new FindQuizByIdHandler(activityReadRepository);
		},
		inject: [PostgresActivityReadRepository],
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
];
