import { ICommandHandler } from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import {
	IProjectProgressRepository,
	ProjectId,
	ProjectProgressId,
} from '@/domain/projects';
import { ProjectProgressNotFoundException } from '../exceptions';

export type RemoveProjectProgressCommand = {
	projectId: string;
	userId: string;
};

export class RemoveProjectProgressHandler
	implements ICommandHandler<RemoveProjectProgressCommand, void>
{
	constructor(
		private readonly projectProgressRepository: IProjectProgressRepository,
	) {}

	async execute(command: RemoveProjectProgressCommand): Promise<void> {
		const projectId = ProjectId.create(UUID.create(command.projectId));
		const userId = UserId.create(UUID.create(command.userId));

		const progressId = ProjectProgressId.create(projectId, userId);
		const wasRemoved = await this.projectProgressRepository.remove(progressId);

		if (!wasRemoved) {
			throw new ProjectProgressNotFoundException(
				progressId.projectId.value,
				progressId.userId.toString(),
			);
		}
	}
}
