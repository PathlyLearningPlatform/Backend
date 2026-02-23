import { ILearningPathsService } from '@/app/interfaces';
import { IActivityProgressRepository } from '../interfaces';
import { StartActivityCommand } from '../commands';
import { ActivityProgress } from '@/domain/activity-progress/entities';
import { randomUUID } from 'crypto';
import { ActivityNotFoundException } from '@/app/exceptions';

export class StartActivityUseCase {
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
		private readonly learningPathsService: ILearningPathsService,
	) {}

	async execute(command: StartActivityCommand): Promise<ActivityProgress> {
		const exists = await this.learningPathsService.activityExistsById(
			command.activityId,
		);

		if (!exists) {
			throw new ActivityNotFoundException(command.activityId);
		}

		// TODO: check if user exists

		const activityProgress = new ActivityProgress({
			activityId: command.activityId,
			userId: command.userId,
			id: randomUUID(),
		});

		await this.activityProgressRepository.save(activityProgress);

		return activityProgress;
	}
}
