import { Activity } from '@/domain/activities/entities';
import { IActivitiesRepository } from '../interfaces';
import { FindActivitiesCommand } from '../commands';

export class FindActivitiesUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: FindActivitiesCommand): Promise<Activity[]> {
		const activities = await this.activitiesRepository.find(command);

		return activities;
	}
}
