import { IQueryHandler, ActivityNotFoundException } from '@/app/common';
import { ActivityDto } from '../dtos';
import { IActivityRepository, ActivityId } from '@/domain/activities';
import { Order } from '@/domain/common';
import { aggregateToDto } from '../helpers';

export type FindPreviousActivityQuery = {
	id: string;
};

export class FindPreviousActivityHandler
	implements IQueryHandler<FindPreviousActivityQuery, ActivityDto>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(command: FindPreviousActivityQuery): Promise<ActivityDto> {
		const id = ActivityId.create(command.id);
		const activity = await this.activityRepository.findById(id);

		if (!activity) {
			throw new ActivityNotFoundException(command.id);
		}

		const previousOrder = Order.create(activity.order.value - 1);
		const previous = await this.activityRepository.findByLessonIdAndOrder(
			activity.lessonId,
			previousOrder,
		);

		if (!previous) {
			throw new ActivityNotFoundException('');
		}

		return aggregateToDto(previous);
	}
}
