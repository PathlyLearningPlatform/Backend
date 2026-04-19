import {
	ActivityNotFoundException,
	type ICommandHandler,
	QuestionNotFoundException,
} from '@/app/common';
import { QuestionId } from '@/domain/quizzes/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Order } from '@/domain/common';
import { IQuizRepository } from '@/domain/quizzes/repositories';

type ReorderQuestionCommand = {
	quizId: string;
	questionId: string;
	order: number;
};

export class ReorderQuestionHandler
	implements ICommandHandler<ReorderQuestionCommand, void>
{
	constructor(private readonly quizRepository: IQuizRepository) {}

	async execute(command: ReorderQuestionCommand): Promise<void> {
		const quizId = ActivityId.create(command.quizId);
		const quiz = await this.quizRepository.findById(quizId);

		if (!quiz) {
			throw new ActivityNotFoundException(quizId.value);
		}

		const questionId = QuestionId.create(command.questionId);
		const newOrder = quiz.reorderQuestion(
			questionId,
			Order.create(command.order),
		);

		if (!newOrder) {
			throw new QuestionNotFoundException(questionId.value);
		}

		quiz.update(new Date());

		await this.quizRepository.save(quiz);
	}
}
