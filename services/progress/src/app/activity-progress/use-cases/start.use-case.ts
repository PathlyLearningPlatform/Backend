import { ILearningPathsService } from '@/app/common/interfaces';
import { IActivityProgressRepository } from '../interfaces';
import { StartActivityCommand } from '../commands';
import { ActivityProgress } from '@/domain/activity-progress/entities';
import { randomUUID } from 'crypto';
import { ActivityNotFoundException } from '@/app/common/exceptions';
import { ActivityAlreadyCompletedException } from '@/domain/activity-progress/exceptions';

export class StartActivityUseCase {
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
		private readonly learningPathsService: ILearningPathsService,
	) {}

	async execute(command: StartActivityCommand): Promise<ActivityProgress> {
		// TODO: check if user exists

		const activity = await this.learningPathsService.findActivityById(
			command.activityId,
		);

		if (!activity) {
			throw new ActivityNotFoundException(command.activityId);
		}

		// TODO: check if lesson is started

		let activityProgress = await this.activityProgressRepository.findOne(
			command.activityId,
			command.userId,
		);

		if (!activityProgress) {
			activityProgress = new ActivityProgress({
				activityId: command.activityId,
				userId: command.userId,
				lessonId: activity.lessonId,
				id: randomUUID(),
			});
		}

		if (activityProgress.completedAt !== null) {
			throw new ActivityAlreadyCompletedException();
		}

		await this.activityProgressRepository.save(activityProgress);

		return activityProgress;
	}
}
