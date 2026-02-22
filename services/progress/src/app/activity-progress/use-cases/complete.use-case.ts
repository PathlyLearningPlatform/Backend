import { ILearningPathsService } from '@/app/interfaces';
import { IActivityProgressRepository } from '../interfaces';
import { CompleteActivityCommand } from '../commands';
import { ActivityProgressNotFoundException } from '@/domain/activity-progress/exceptions';
import { ActivityNotFoundException } from '@/app/exceptions';

export class CompleteActivityUseCase {
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
		private readonly learningPathsService: ILearningPathsService,
	) {}

	async execute(command: CompleteActivityCommand): Promise<void> {
		const exists = await this.learningPathsService.activityExistsById(
			command.activityId,
		);

		if (!exists) {
			throw new ActivityNotFoundException(command.activityId);
		}

		// TODO: check if user exists

		const activityProgress = await this.activityProgressRepository.findOne(
			command.activityId,
			command.userId,
		);

		if (!activityProgress) {
			throw new ActivityProgressNotFoundException(
				command.userId,
				command.activityId,
			);
		}

		activityProgress.complete();

		await this.activityProgressRepository.save(activityProgress);
	}
}
