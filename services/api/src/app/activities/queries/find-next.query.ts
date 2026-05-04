import { IQueryHandler, ActivityNotFoundException } from '@/app/common';
import { ActivityDto } from '../dtos';
import { IActivityRepository, ActivityId } from '@/domain/activities';
import { Order } from '@/domain/common';
import { aggregateToDto } from '../helpers';

export type FindNextActivityQuery = {
	id: string;
};

export class FindNextActivityHandler
	implements IQueryHandler<FindNextActivityQuery, ActivityDto>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(command: FindNextActivityQuery): Promise<ActivityDto> {
		const id = ActivityId.create(command.id);
		const activity = await this.activityRepository.findById(id);

		if (!activity) {
			throw new ActivityNotFoundException(command.id);
		}

		const nextOrder = Order.create(activity.order.value + 1);
		const next = await this.activityRepository.findByLessonIdAndOrder(
			activity.lessonId,
			nextOrder,
		);

		if (!next) {
			throw new ActivityNotFoundException('');
		}

		return aggregateToDto(next);
	}
}
