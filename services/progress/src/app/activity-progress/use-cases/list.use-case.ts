import { ActivityProgress } from '@/domain/activity-progress/entities';
import { ListActivityProgressCommand } from '../commands';
import { IActivityProgressRepository } from '../interfaces';

export class ListActivityProgressUseCase {
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
	) {}

	async execute(
		command?: ListActivityProgressCommand,
	): Promise<ActivityProgress[]> {
		const activityProgress =
			await this.activityProgressRepository.list(command);

		return activityProgress;
	}
}
