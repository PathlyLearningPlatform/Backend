import {
	ActivityNotFoundException,
	type ICommandHandler,
	QuestionNotFoundException,
} from "@/app/common";
import { Quiz } from "@/domain/activities/quizzes/quiz.aggregate";
import { QuestionId } from "@/domain/activities/quizzes/value-objects";
import type { IActivityRepository } from "@/domain/activities/repositories";
import { ActivityId } from "@/domain/activities/value-objects/id.vo";
import { Order } from "@/domain/common";

type ReorderQuestionCommand = {
	quizId: string;
	questionId: string;
	order: number;
};

export class ReorderQuestionHandler
	implements ICommandHandler<ReorderQuestionCommand, void>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(command: ReorderQuestionCommand): Promise<void> {
		const quizId = ActivityId.create(command.quizId);
		const activity = await this.activityRepository.load(quizId);

		if (!activity || !(activity instanceof Quiz)) {
			throw new ActivityNotFoundException(quizId.value);
		}

		const questionId = QuestionId.create(command.questionId);
		const newOrder = activity.reorderQuestion(
			questionId,
			Order.create(command.order),
		);

		if (!newOrder) {
			throw new QuestionNotFoundException(questionId.value);
		}

		activity.update(new Date());

		await this.activityRepository.save(activity);
	}
}
