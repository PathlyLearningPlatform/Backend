import { ICommandHandler } from '@/app/common';
import {
	ActivityProgressId,
	IActivityProgressRepository,
} from '@/domain/activity-progress';
import { UUID } from '@/domain/common';
import { ActivityProgressNotFoundException } from '../exceptions';

export type RemoveActivityProgressCommand = {
	id: string;
};

export class RemoveActivityProgressHandler
	implements ICommandHandler<RemoveActivityProgressCommand, void>
{
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
	) {}

	async execute(command: RemoveActivityProgressCommand): Promise<void> {
		const wasRemoved = await this.activityProgressRepository.remove(
			ActivityProgressId.create(UUID.create(command.id)),
		);

		if (!wasRemoved) {
			throw new ActivityProgressNotFoundException(command.id);
		}
	}
}
