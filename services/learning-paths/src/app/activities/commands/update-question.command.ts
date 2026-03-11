import {
	ICommandHandler,
	ActivityNotFoundException,
	QuestionNotFoundException,
} from '@/app/common';
import { IActivityRepository } from '@/domain/activities/interfaces';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Quiz } from '@/domain/activities/quizzes/quiz.aggregate';
import { QuestionId } from '@/domain/activities/quizzes/value-objects';
import { QuestionDto } from '../dtos';

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
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(command: UpdateQuestionCommand): Promise<UpdateQuestionResult> {
		const quizId = ActivityId.create(command.quizId);
		const activity = await this.activityRepository.load(quizId);

		if (!activity || !(activity instanceof Quiz)) {
			throw new ActivityNotFoundException(quizId.value);
		}

		const questionId = QuestionId.create(command.questionId);
		const question = activity.findQuestion(questionId);

		if (!question) {
			throw new QuestionNotFoundException(questionId.value);
		}

		question.update(new Date(), {
			content: command.props?.content,
			correctAnswer: command.props?.correctAnswer,
		});

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
