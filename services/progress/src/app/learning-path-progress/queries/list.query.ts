import { IQueryHandler, OffsetPagination } from '@/app/common';
import { LearningPathProgressDto } from '../dtos';
import { ILearningPathProgressReadRepository } from '../interfaces';

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
		private readonly learningPathProgressReadRepository: ILearningPathProgressReadRepository,
	) {}

	async execute(
		query: ListLearningPathProgressQuery,
	): Promise<ListLearningPathProgressResult> {
		const learningPathProgress =
			await this.learningPathProgressReadRepository.list({
				options: {
					limit: query.options?.limit,
					page: query.options?.page,
				},
				where: {
					userId: query.where?.userId,
				},
			});

		return learningPathProgress;
	}
}
