import {
	ICommandHandler,
	ActivityNotFoundException,
	QuestionNotFoundException,
} from '@/app/common';
import { IActivityRepository } from '@/domain/activities/interfaces';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Quiz } from '@/domain/activities/quizzes/quiz.aggregate';
import { QuestionId } from '@/domain/activities/quizzes/value-objects';

type RemoveQuestionCommand = {
	quizId: string;
	questionId: string;
};

export class RemoveQuestionHandler
	implements ICommandHandler<RemoveQuestionCommand, void>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(command: RemoveQuestionCommand): Promise<void> {
		const quizId = ActivityId.create(command.quizId);
		const activity = await this.activityRepository.load(quizId);

		if (!activity || !(activity instanceof Quiz)) {
			throw new ActivityNotFoundException(quizId.value);
		}

		const questionId = QuestionId.create(command.questionId);

		if (!activity.questions.find((q) => q.id.equals(questionId))) {
			throw new QuestionNotFoundException(questionId.value);
		}

		activity.removeQuestion(questionId);
		activity.update(new Date());

		await this.activityRepository.save(activity);
	}
}
