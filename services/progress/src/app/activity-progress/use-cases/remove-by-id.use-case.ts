import { ActivityProgressNotFoundException } from '@/domain/activity-progress/exceptions';
import { IActivityProgressRepository } from '../interfaces';

export class RemoveActivityProgressByIdUseCase {
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
	) {}

	async execute(id: string): Promise<void> {
		const wasRemoved = await this.activityProgressRepository.removeById(id);

		if (!wasRemoved) {
			throw new ActivityProgressNotFoundException(id);
		}
	}
}
