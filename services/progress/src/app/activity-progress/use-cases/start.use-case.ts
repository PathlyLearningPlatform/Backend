import { ILearningPathsService } from '@/app/interfaces';
import { IActivityProgressRepository } from '../interfaces';
import { StartActivityCommand } from '../commands';
import { ActivityProgress } from '@/domain/activity-progress/entities';
import { randomUUID } from 'crypto';
import { ActivityNotFoundException } from '@/app/exceptions';
import { ActivityAlreadyCompletedException } from '@/domain/activity-progress/exceptions';

export class StartActivityUseCase {
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
		private readonly learningPathsService: ILearningPathsService,
	) {}

	async execute(command: StartActivityCommand): Promise<ActivityProgress> {
		// TODO: check if user exists

		const exists = await this.learningPathsService.activityExistsById(
			command.activityId,
		);

		if (!exists) {
			throw new ActivityNotFoundException(command.activityId);
		}

		const activityProgress = await this.activityProgressRepository.findOne(
			command.activityId,
			command.userId,
		);

		if (activityProgress) {
			if (activityProgress.completedAt !== null) {
				throw new ActivityAlreadyCompletedException();
			}

			return activityProgress;
		}

		const newActivityProgress = new ActivityProgress({
			activityId: command.activityId,
			userId: command.userId,
			id: randomUUID(),
		});

		await this.activityProgressRepository.save(newActivityProgress);

		return newActivityProgress;
	}
}
