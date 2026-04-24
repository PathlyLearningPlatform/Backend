import { IQueryHandler } from '@/app/common';
import { ProjectDto } from '../dtos';
import { IProjectRepository, ProjectId } from '@/domain/projects';
import { UUID } from '@/domain/common';
import { ProjectNotFoundException } from '../exceptions';
import { aggregateToDto } from '../helpers';

export type FindProjectByIdQuery = {
	id: string;
};

export class FindProjectByIdHandler
	implements IQueryHandler<FindProjectByIdQuery, ProjectDto>
{
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(command: FindProjectByIdQuery): Promise<ProjectDto> {
		const projectId = ProjectId.create(UUID.create(command.id));
		const project = await this.projectRepository.findById(projectId);

		if (!project) {
			throw new ProjectNotFoundException(projectId.value);
		}

		return aggregateToDto(project);
	}
}
