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
import type {
	IActivityProgressReadRepository,
	IActivityReadRepository,
} from '@/app/activities/interfaces';
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
import type { IActivityProgressRepository } from '@/domain/activities';
import type { IActivityRepository } from '@/domain/activities/repositories';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { InMemoryEventBus } from '../common/adapters';
import { DiToken } from '../common/enums';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { PostgresActivityRepository } from './postgres.repository';
import { PostgresActivityProgressRepository } from './postgres-progress.repository';
import { PostgresActivityProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresActivityReadRepository } from './postgres-read.repository';

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
	{
		provide: DiToken.COMPLETE_ACTIVITY_HANDLER,
		useFactory(
			activityProgressRepository: IActivityProgressRepository,
			activityReadRepository: IActivityReadRepository,
			eventBus: IEventBus,
		) {
			return new CompleteActivityHandler(
				activityProgressRepository,
				activityReadRepository,
				eventBus,
			);
		},
		inject: [
			PostgresActivityProgressRepository,
			PostgresActivityReadRepository,
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
		useFactory(
			activityProgressReadRepository: IActivityProgressReadRepository,
		) {
			return new ListActivityProgressHandler(activityProgressReadRepository);
		},
		inject: [PostgresActivityProgressReadRepository],
	},
	{
		provide: DiToken.FIND_ACTIVITY_PROGRESS_FOR_USER_HANDLER,
		useFactory(
			activityProgressReadRepository: IActivityProgressReadRepository,
		) {
			return new FindActivityProgressForUserHandler(
				activityProgressReadRepository,
			);
		},
		inject: [PostgresActivityProgressReadRepository],
	},
];
