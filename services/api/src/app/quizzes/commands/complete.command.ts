import { ICommandHandler } from '@/app/common';
import { QuizNotFoundException } from '@/app/common/exceptions/quiz-not-found.exception';
import { ActivityId } from '@/domain/activities';
import { UserId, UUID } from '@/domain/common';
import {
	QuestionId,
	QuizAttempt,
	QuizAttemptId,
	UserAnswer,
} from '@/domain/quizzes';
import { QuizService } from '@/domain/quizzes/quiz.service';
import {
	IQuizAttemptRepository,
	IQuizRepository,
} from '@/domain/quizzes/repositories';
import { randomUUID } from 'crypto';
import { QuizAttemptDto } from '../dtos';
import { attemptToDto } from '../helpers';

export type CompleteQuizCommand = {
	quizId: string;
	userId: string;
	answers: {
		questionId: string;
		text: string;
	}[];
};

export class CompleteQuizHandler
	implements ICommandHandler<CompleteQuizCommand, QuizAttemptDto>
{
	constructor(
		private readonly quizRepository: IQuizRepository,
		private readonly quizAttemptRepository: IQuizAttemptRepository,
		private readonly quizService: QuizService,
	) {}

	async execute(command: CompleteQuizCommand): Promise<QuizAttemptDto> {
		// TODO: check if user exists
		const quizId = ActivityId.create(command.quizId);
		const userId = UserId.create(UUID.create(command.userId));

		const quiz = await this.quizRepository.findById(quizId);

		if (!quiz) {
			throw new QuizNotFoundException(command.quizId);
		}

		const attemptId = QuizAttemptId.create(UUID.create(randomUUID()));
		const attempt = QuizAttempt.create(attemptId, {
			quizId,
			userId,
			attemptedAt: new Date(),
			answers: command.answers.map((item) =>
				UserAnswer.create({
					isCorrect: null,
					questionId: QuestionId.create(item.questionId),
					text: item.text,
				}),
			),
		});

		// TODO: add better answer verification function
		await this.quizService.complete(
			quiz,
			attempt,
			async (userAnswer, correctAnswer) => userAnswer === correctAnswer,
		);

		await this.quizAttemptRepository.save(attempt);

		return attemptToDto(attempt);
	}
}
