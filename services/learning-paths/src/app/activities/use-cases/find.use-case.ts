import type { Activity } from '@/domain/activities/entities';
import type { FindActivitiesCommand } from '../commands';
import type { IActivitiesRepository } from '@domain/activities/interfaces';

export class FindActivitiesUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command?: FindActivitiesCommand): Promise<Activity[]> {
		const activities = await this.activitiesRepository.find(command);

		return activities;
	}
}
