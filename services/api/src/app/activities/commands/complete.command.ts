import {
	ActivityNotFoundException,
	type ICommandHandler,
	type IEventBus,
} from '@/app/common';
import {
	ActivityId,
	ActivityProgress,
	ActivityProgressId,
	type IActivityRepository,
	type IActivityProgressRepository,
} from '@/domain/activities';
import { UserId, UUID } from '@/domain/common';
import type { ActivityProgressDto } from '../dtos';
import { progressAggregateToDto } from '../helpers';

export type CompleteActivityCommand = {
	activityId: string;
	userId: string;
};
export type CompleteActivityResult = ActivityProgressDto;

export class CompleteActivityHandler
	implements ICommandHandler<CompleteActivityCommand, CompleteActivityResult>
{
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
		private readonly activityRepository: IActivityRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(
		command: CompleteActivityCommand,
	): Promise<CompleteActivityResult> {
		const activityId = ActivityId.create(command.activityId);
		const activity = await this.activityRepository.findById(activityId);

		if (!activity) {
			throw new ActivityNotFoundException(command.activityId);
		}

		const userId = UserId.create(UUID.create(command.userId));
		const id = ActivityProgressId.create(activityId, userId);
		const activityProgress = ActivityProgress.create(id, {
			lessonId: activity.lessonId,
		});

		activityProgress.complete(new Date());

		await this.activityProgressRepository.save(activityProgress);

		const events = activityProgress.pullEvents();
		await this.eventBus.publish(events);

		return progressAggregateToDto(activityProgress);
	}
}
