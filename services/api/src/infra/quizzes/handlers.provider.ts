import type { Provider } from '@nestjs/common';
import {
	AddQuestionHandler,
	AddQuizHandler,
	FindQuizByIdHandler,
	ListQuizzesHandler,
	RemoveQuestionHandler,
	ReorderQuestionHandler,
	UpdateQuestionHandler,
} from '@app/quizzes';
import type { IActivityRepository } from '@/domain/activities';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { DiToken } from '@infra/common';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { PostgresActivityRepository } from '@infra/activities/postgres.repository';

export const quizHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_QUIZZES_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new ListQuizzesHandler(activityRepository);
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
		provide: DiToken.ADD_QUIZ_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			activityRepository: IActivityRepository,
		) {
			return new AddQuizHandler(lessonRepository, activityRepository);
		},
		inject: [PostgresLessonRepository, PostgresActivityRepository],
	},
];
