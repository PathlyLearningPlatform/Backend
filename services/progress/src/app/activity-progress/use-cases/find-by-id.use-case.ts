import { ActivityProgress } from '@/domain/activity-progress/entities';
import { IActivityProgressRepository } from '../interfaces';
import { ActivityProgressNotFoundException } from '@/domain/activity-progress/exceptions';

export class FindActivityProgressByIdUseCase {
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
	) {}

	async execute(id: string): Promise<ActivityProgress> {
		const activityProgress = await this.activityProgressRepository.findById(id);

		if (!activityProgress) {
			throw new ActivityProgressNotFoundException(id);
		}

		return activityProgress;
	}
}
