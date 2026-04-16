import { ActivityNotFoundException, type IQueryHandler } from '@/app/common';
import { ActivityId, IActivityRepository } from '@/domain/activities';
import type { ActivityDto } from '../dtos';
import { aggregateToDto } from '../helpers';

type FindActivityByIdQuery = {
	where: {
		id: string;
	};
};
type FindActivityByIdResult = ActivityDto;

export class FindActivityByIdHandler
	implements IQueryHandler<FindActivityByIdQuery, FindActivityByIdResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(query: FindActivityByIdQuery): Promise<FindActivityByIdResult> {
		const activityId = ActivityId.create(query.where.id);
		const activity = await this.activityRepository.findById(activityId);

		if (!activity) {
			throw new ActivityNotFoundException(query.where.id);
		}

		return aggregateToDto(activity);
	}
}
