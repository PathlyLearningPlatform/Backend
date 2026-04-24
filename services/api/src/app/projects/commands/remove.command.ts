import { ICommandHandler } from '@/app/common';
import { IProjectRepository, ProjectId } from '@/domain/projects';
import { UUID } from '@/domain/common';
import { ProjectNotFoundException } from '../exceptions';

export type RemoveProjectCommand = {
	id: string;
};

export class RemoveProjectHandler
	implements ICommandHandler<RemoveProjectCommand, void>
{
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(command: RemoveProjectCommand): Promise<void> {
		const id = ProjectId.create(UUID.create(command.id));
		const wasRemoved = await this.projectRepository.remove(id);

		if (!wasRemoved) {
			throw new ProjectNotFoundException(id.value);
		}
	}
}
