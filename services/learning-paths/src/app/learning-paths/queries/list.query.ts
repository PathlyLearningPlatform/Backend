import { IQueryHandler, OffsetPagination } from '@/app/common';
import { ILearningPathReadRepository } from '../interfaces';
import { LearningPathDto } from '../dtos';

type ListLearningPathsQuery = {
	options?: OffsetPagination;
};
type ListLearningPathsResult = LearningPathDto[];

export class ListLearningPathsHandler
	implements IQueryHandler<ListLearningPathsQuery, ListLearningPathsResult>
{
	constructor(
		private readonly learningPathReadRepository: ILearningPathReadRepository,
	) {}

	async execute(
		query: ListLearningPathsQuery,
	): Promise<ListLearningPathsResult> {
		const learningPaths = await this.learningPathReadRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return learningPaths;
	}
}
