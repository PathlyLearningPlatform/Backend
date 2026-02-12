import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import type { IActivitiesRepository } from '@domain/activities/interfaces';

export class RemoveActivityUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(id: string): Promise<void> {
		const wasRemoved = await this.activitiesRepository.remove(id);

		if (!wasRemoved) {
			throw new ActivityNotFoundException(id);
		}
	}
}
