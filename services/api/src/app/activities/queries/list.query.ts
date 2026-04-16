import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { ActivityDto } from '../dtos';
import { IActivityRepository } from '@/domain/activities';
import { aggregateToDto } from '../helpers';

type ListActivitiesQuery = {
	where?: {
		lessonId?: string;
	};
	options?: OffsetPagination;
};
type ListActivitiesResult = ActivityDto[];

export class ListActivitiesHandler
	implements IQueryHandler<ListActivitiesQuery, ListActivitiesResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(query: ListActivitiesQuery): Promise<ListActivitiesResult> {
		const activities = await this.activityRepository.list({
			where: {
				lessonId: query.where?.lessonId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return activities.map(aggregateToDto);
	}
}
