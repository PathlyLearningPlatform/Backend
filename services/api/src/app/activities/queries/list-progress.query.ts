import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { ActivityProgressDto } from '../dtos';
import { IActivityProgressRepository } from '@/domain/activities';
import { progressAggregateToDto } from '../helpers';

export type ListActivityProgressQuery = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
		lessonId: string;
	}>;
};
export type ListActivityProgressResult = ActivityProgressDto[];

export class ListActivityProgressHandler
	implements
		IQueryHandler<ListActivityProgressQuery, ListActivityProgressResult>
{
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
	) {}

	async execute(
		query: ListActivityProgressQuery,
	): Promise<ListActivityProgressResult> {
		const activityProgress = await this.activityProgressRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
			where: {
				lessonId: query.where?.lessonId,
				userId: query.where?.userId,
			},
		});

		return activityProgress.map(progressAggregateToDto);
	}
}
