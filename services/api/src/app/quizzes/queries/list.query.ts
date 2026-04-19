import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { QuizWithoutQuestionsDto } from '../dtos';
import { aggregateToPreviewDto } from '../helpers';
import { IQuizRepository } from '@/domain/quizzes/repositories';

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
	constructor(private readonly quizRepository: IQuizRepository) {}

	async execute(query: ListQuizzesQuery): Promise<ListQuizzesResult> {
		const quizzes = await this.quizRepository.list({
			where: {
				lessonId: query.where?.lessonId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return quizzes.map(aggregateToPreviewDto);
	}
}
