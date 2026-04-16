import { ActivityNotFoundException, type IQueryHandler } from '@/app/common';
import { ActivityId, IActivityRepository } from '@/domain/activities';
import type { QuizDto } from '../dtos';
import { quizAggregateToDto } from '../helpers';

type FindQuizByIdQuery = {
	where: {
		id: string;
	};
};
type FindQuizByIdResult = QuizDto;

export class FindQuizByIdHandler
	implements IQueryHandler<FindQuizByIdQuery, FindQuizByIdResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(query: FindQuizByIdQuery): Promise<FindQuizByIdResult> {
		const activityId = ActivityId.create(query.where.id);
		const quiz = await this.activityRepository.findQuizById(activityId);

		if (!quiz) {
			throw new ActivityNotFoundException(query.where.id);
		}

		return quizAggregateToDto(quiz);
	}
}
