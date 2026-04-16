import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { LearningPathDto } from '../dtos';
import { ILearningPathRepository } from '@/domain/learning-paths';
import { aggregateToDto } from '../helpers';

type ListLearningPathsQuery = {
	options?: OffsetPagination;
};
type ListLearningPathsResult = LearningPathDto[];

export class ListLearningPathsHandler
	implements IQueryHandler<ListLearningPathsQuery, ListLearningPathsResult>
{
	constructor(
		private readonly learningPathRepository: ILearningPathRepository,
	) {}

	async execute(
		query: ListLearningPathsQuery,
	): Promise<ListLearningPathsResult> {
		const learningPaths = await this.learningPathRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return learningPaths.map(aggregateToDto);
	}
}
