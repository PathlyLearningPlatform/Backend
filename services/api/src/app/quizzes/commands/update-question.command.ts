import {
	ActivityNotFoundException,
	type ICommandHandler,
	QuestionNotFoundException,
} from '@/app/common';
import { QuestionId } from '@/domain/quizzes/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import type { QuestionDto } from '../dtos';
import { IQuizRepository } from '@/domain/quizzes/repositories';

type UpdateQuestionCommand = {
	quizId: string;
	questionId: string;
	props?: {
		content?: string;
		correctAnswer?: string;
	};
};
type UpdateQuestionResult = QuestionDto;

export class UpdateQuestionHandler
	implements ICommandHandler<UpdateQuestionCommand, UpdateQuestionResult>
{
	constructor(private readonly quizRepository: IQuizRepository) {}

	async execute(command: UpdateQuestionCommand): Promise<UpdateQuestionResult> {
		const quizId = ActivityId.create(command.quizId);
		const quiz = await this.quizRepository.findById(quizId);

		if (!quiz) {
			throw new ActivityNotFoundException(quizId.value);
		}

		const questionId = QuestionId.create(command.questionId);
		const question = quiz.findQuestion(questionId);

		if (!question) {
			throw new QuestionNotFoundException(questionId.value);
		}

		question.update(new Date(), {
			content: command.props?.content,
			correctAnswer: command.props?.correctAnswer,
		});

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
