import { ActivityProgress } from '@/domain/activity-progress/entities';
import { IActivityProgressRepository } from '../interfaces';
import { ActivityProgressNotFoundException } from '@/domain/activity-progress/exceptions';

export class FindOneActivityProgressUseCase {
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
	) {}

	async execute(activityId: string, userId: string): Promise<ActivityProgress> {
		const activityProgress = await this.activityProgressRepository.findOne(
			activityId,
			userId,
		);

		if (!activityProgress) {
			throw new ActivityProgressNotFoundException(
				undefined,
				activityId,
				userId,
			);
		}

		return activityProgress;
	}
}
