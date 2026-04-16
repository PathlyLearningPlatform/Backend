import {
	ActivityNotFoundException,
	type ICommandHandler,
	QuestionNotFoundException,
} from '@/app/common';
import { Quiz } from '@/domain/quizzes/quiz.aggregate';
import { QuestionId } from '@/domain/quizzes/value-objects';
import type { IActivityRepository } from '@/domain/activities/repositories';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';

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
		const activity = await this.activityRepository.findById(quizId);

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
