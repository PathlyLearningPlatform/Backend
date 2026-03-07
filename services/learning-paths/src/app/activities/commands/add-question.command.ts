import { ICommandHandler, ActivityNotFoundException } from '@/app/common';
import { IActivityRepository } from '@/domain/activities/interfaces';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Quiz } from '@/domain/activities/quizzes/quiz.aggregate';
import { Question } from '@/domain/activities/quizzes/question.entity';
import { QuestionId } from '@/domain/activities/quizzes/value-objects';
import { Order } from '@/domain/common';
import { randomUUID } from 'node:crypto';
import { QuestionDto } from '../dtos';

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
		const activity = await this.activityRepository.load(quizId);

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
		};
	}
}
