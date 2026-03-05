import { IActivityProgressRepository } from '../interfaces';
import { CompleteActivityCommand } from '../commands';
import { ActivityProgressNotFoundException } from '@/domain/activity-progress/exceptions';
import { ActivityProgress } from '@/domain/activity-progress/entities';
import { IEventBus } from '@/app/common';

export class CompleteActivityUseCase {
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: CompleteActivityCommand): Promise<ActivityProgress> {
		const activityProgress = await this.activityProgressRepository.findOne(
			command.activityId,
			command.userId,
		);

		if (!activityProgress) {
			throw new ActivityProgressNotFoundException(
				undefined,
				command.activityId,
				command.userId,
			);
		}

		activityProgress.complete(new Date());

		const events = await this.activityProgressRepository.save(activityProgress);

		await this.eventBus.publish(events);

		return activityProgress;
	}
}
