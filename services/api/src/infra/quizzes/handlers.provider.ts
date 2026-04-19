import type { Provider } from '@nestjs/common';
import {
	AddQuestionHandler,
	AddQuizHandler,
	CompleteQuizHandler,
	FindQuizAttemptForUserHandler,
	FindQuizByIdHandler,
	ListQuizAttemptsHandler,
	ListQuizzesHandler,
	RemoveQuestionHandler,
	ReorderQuestionHandler,
	UpdateQuestionHandler,
} from '@app/quizzes';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { DiToken } from '@infra/common';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { PostgresQuizRepository } from './postgres.repository';
import { PostgresQuizAttemptRepository } from './postgres-attempt.repository';
import { QuizService } from '@/domain/quizzes/quiz.service';
import { FindQuizAttemptByIdHandler } from '@/app/quizzes/queries/find-attempt-by-id.query';
import {
	IQuizRepository,
	IQuizAttemptRepository,
} from '@/domain/quizzes/repositories';

export const quizHandlersProvider: Provider[] = [
	{
		provide: DiToken.LIST_QUIZZES_HANDLER,
		useFactory(quizRepository: IQuizRepository) {
			return new ListQuizzesHandler(quizRepository);
		},
		inject: [PostgresQuizRepository],
	},
	{
		provide: DiToken.FIND_QUIZ_BY_ID_HANDLER,
		useFactory(quizRepository: IQuizRepository) {
			return new FindQuizByIdHandler(quizRepository);
		},
		inject: [PostgresQuizRepository],
	},
	{
		provide: DiToken.ADD_QUESTION_HANDLER,
		useFactory(quizRepository: IQuizRepository) {
			return new AddQuestionHandler(quizRepository);
		},
		inject: [PostgresQuizRepository],
	},
	{
		provide: DiToken.UPDATE_QUESTION_HANDLER,
		useFactory(quizRepository: IQuizRepository) {
			return new UpdateQuestionHandler(quizRepository);
		},
		inject: [PostgresQuizRepository],
	},
	{
		provide: DiToken.REMOVE_QUESTION_HANDLER,
		useFactory(quizRepository: IQuizRepository) {
			return new RemoveQuestionHandler(quizRepository);
		},
		inject: [PostgresQuizRepository],
	},
	{
		provide: DiToken.REORDER_QUESTION_HANDLER,
		useFactory(quizRepository: IQuizRepository) {
			return new ReorderQuestionHandler(quizRepository);
		},
		inject: [PostgresQuizRepository],
	},
	{
		provide: DiToken.ADD_QUIZ_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			quizRepository: IQuizRepository,
		) {
			return new AddQuizHandler(lessonRepository, quizRepository);
		},
		inject: [PostgresLessonRepository, PostgresQuizRepository],
	},
	{
		provide: DiToken.QUIZ_SERVICE,
		useFactory() {
			return new QuizService();
		},
	},
	{
		provide: DiToken.COMPLETE_QUIZ_HANDLER,
		useFactory(
			quizRepository: IQuizRepository,
			quizAttemptRepository: IQuizAttemptRepository,
			quizService: QuizService,
		) {
			return new CompleteQuizHandler(
				quizRepository,
				quizAttemptRepository,
				quizService,
			);
		},
		inject: [
			PostgresQuizRepository,
			PostgresQuizAttemptRepository,
			DiToken.QUIZ_SERVICE,
		],
	},
	{
		provide: DiToken.LIST_QUIZ_ATTEMPTS_HANDLER,
		useFactory(quizAttemptRepository: IQuizAttemptRepository) {
			return new ListQuizAttemptsHandler(quizAttemptRepository);
		},
		inject: [PostgresQuizAttemptRepository],
	},
	{
		provide: DiToken.FIND_QUIZ_ATTEMPT_BY_ID_HANDLER,
		useFactory(quizAttemptRepository: IQuizAttemptRepository) {
			return new FindQuizAttemptByIdHandler(quizAttemptRepository);
		},
		inject: [PostgresQuizAttemptRepository],
	},
	{
		provide: DiToken.FIND_QUIZ_ATTEMPT_FOR_USER_HANDLER,
		useFactory(quizAttemptRepository: IQuizAttemptRepository) {
			return new FindQuizAttemptForUserHandler(quizAttemptRepository);
		},
		inject: [PostgresQuizAttemptRepository],
	},
];
