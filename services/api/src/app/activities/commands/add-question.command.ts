import { randomUUID } from 'node:crypto';
import { ActivityNotFoundException, type ICommandHandler } from '@/app/common';
import { Question } from '@/domain/quizzes/question.entity';
import { Quiz } from '@/domain/quizzes/quiz.aggregate';
import { QuestionId } from '@/domain/quizzes/value-objects';
import type { IActivityRepository } from '@/domain/activities/repositories';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Order } from '@/domain/common';
import type { QuestionDto } from '../dtos';

type AddQuestionCommand = {
	quizId: string;
	content: string;
	correctAnswer: string;
};
type AddQuestionResult = QuestionDto;

export class AddQuestionHandler
	implements ICommandHandler<AddQuestionCommand, AddQuestionResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(command: AddQuestionCommand): Promise<AddQuestionResult> {
		const quizId = ActivityId.create(command.quizId);
		const activity = await this.activityRepository.findById(quizId);

		if (!activity || !(activity instanceof Quiz)) {
			throw new ActivityNotFoundException(quizId.value);
		}

		const question = Question.create(QuestionId.create(randomUUID()), {
			quizId,
			content: command.content,
			correctAnswer: command.correctAnswer,
			order: Order.create(activity.questionCount),
			createdAt: new Date(),
		});

		activity.addQuestion(question);
		activity.update(new Date());

		await this.activityRepository.save(activity);

		return {
			id: question.id.value,
			quizId: question.quizId.value,
			content: question.content,
			correctAnswer: question.correctAnswer,
			order: question.order.value,
		};
	}
}
