import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { QuizWithoutQuestionsDto } from '../dtos';
import { IActivityRepository } from '@/domain/activities';
import { quizAggregateToPreviewDto } from '../helpers';

type ListQuizzesQuery = {
	where?: {
		lessonId?: string;
	};
	options?: OffsetPagination;
};
type ListQuizzesResult = QuizWithoutQuestionsDto[];

export class ListQuizzesHandler
	implements IQueryHandler<ListQuizzesQuery, ListQuizzesResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(query: ListQuizzesQuery): Promise<ListQuizzesResult> {
		const quizzes = await this.activityRepository.listQuizzes({
			where: {
				lessonId: query.where?.lessonId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return quizzes.map(quizAggregateToPreviewDto);
	}
}
