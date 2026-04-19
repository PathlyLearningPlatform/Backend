import { randomUUID } from 'node:crypto';
import { type ICommandHandler } from '@/app/common';
import { Question } from '@/domain/quizzes/question.entity';
import { QuestionId } from '@/domain/quizzes/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Order } from '@/domain/common';
import type { QuestionDto } from '../dtos';
import { IQuizRepository } from '@/domain/quizzes/repositories';
import { QuizNotFoundException } from '@/app/common/exceptions/quiz-not-found.exception';

type AddQuestionCommand = {
	quizId: string;
	content: string;
	correctAnswer: string;
};
type AddQuestionResult = QuestionDto;

export class AddQuestionHandler
	implements ICommandHandler<AddQuestionCommand, AddQuestionResult>
{
	constructor(private readonly quizRepository: IQuizRepository) {}

	async execute(command: AddQuestionCommand): Promise<AddQuestionResult> {
		const quizId = ActivityId.create(command.quizId);
		const quiz = await this.quizRepository.findById(quizId);

		if (!quiz) {
			throw new QuizNotFoundException(quizId.value);
		}

		const question = Question.create(QuestionId.create(randomUUID()), {
			quizId,
			content: command.content,
			correctAnswer: command.correctAnswer,
			order: Order.create(quiz.questionCount),
			createdAt: new Date(),
		});

		quiz.addQuestion(question);
		quiz.update(new Date());

		await this.quizRepository.save(quiz);

		return {
			id: question.id.value,
			quizId: question.quizId.value,
			content: question.content,
			correctAnswer: question.correctAnswer,
			order: question.order.value,
		};
	}
}
