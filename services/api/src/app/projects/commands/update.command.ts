import { ICommandHandler } from '@/app/common';
import { ProjectDto } from '../dtos';
import { IProjectRepository, ProjectId } from '@/domain/projects';
import { UUID } from '@/domain/common';
import { aggregateToDto } from '../helpers';
import { ProjectNotFoundException } from '../exceptions';

export type UpdateProjectCommand = {
	where: {
		id: string;
	};
	fields: Partial<{
		name: string;
		description: string | null;
	}>;
};

export class UpdateProjectHandler
	implements ICommandHandler<UpdateProjectCommand, ProjectDto>
{
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(command: UpdateProjectCommand): Promise<ProjectDto> {
		const projectId = ProjectId.create(UUID.create(command.where.id));
		const project = await this.projectRepository.findById(projectId);

		if (!project) {
			throw new ProjectNotFoundException(command.where.id);
		}

		project.update(new Date(), {
			name: command.fields.name,
			description: command.fields.description,
		});

		await this.projectRepository.save(project);

		return aggregateToDto(project);
	}
}
