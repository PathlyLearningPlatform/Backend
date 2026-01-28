import type { Activity } from '@/domain/activities/entities';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import type { IActivitiesRepository } from '../interfaces';

export class FindOneActivityUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(id: string): Promise<Activity> {
		const activity = await this.activitiesRepository.findOne(id);

		if (!activity) {
			throw new ActivityNotFoundException(id);
		}

		return activity;
	}
}
