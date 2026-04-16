import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { LearningPathProgressDto } from '../dtos';
import { ILearningPathProgressRepository } from '@/domain/learning-paths';
import { progressAggregateToDto } from '../helpers';

export type ListLearningPathProgressQuery = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
	}>;
};
export type ListLearningPathProgressResult = LearningPathProgressDto[];

export class ListLearningPathProgressHandler
	implements
		IQueryHandler<ListLearningPathProgressQuery, ListLearningPathProgressResult>
{
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
	) {}

	async execute(
		query: ListLearningPathProgressQuery,
	): Promise<ListLearningPathProgressResult> {
		const learningPathProgress = await this.learningPathProgressRepository.list(
			{
				options: {
					limit: query.options?.limit,
					page: query.options?.page,
				},
				where: {
					userId: query.where?.userId,
				},
			},
		);

		return learningPathProgress.map(progressAggregateToDto);
	}
}
