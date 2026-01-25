import { Activity } from '@/domain/activities/entities';
import { IActivitiesRepository } from '../interfaces';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';

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
