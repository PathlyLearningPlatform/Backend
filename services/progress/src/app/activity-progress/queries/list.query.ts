import { IQueryHandler, OffsetPagination } from '@/app/common';
import { ActivityProgressDto } from '../dtos';
import { IActivityProgressReadRepository } from '../interfaces';

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
		private readonly activityProgressReadRepository: IActivityProgressReadRepository,
	) {}

	async execute(
		query: ListActivityProgressQuery,
	): Promise<ListActivityProgressResult> {
		const activityProgress = await this.activityProgressReadRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
			where: {
				lessonId: query.where?.lessonId,
				userId: query.where?.userId,
			},
		});

		return activityProgress;
	}
}
