import { IQueryHandler } from '@/app/common';
import { ProjectDto } from '../dtos';
import { IProjectRepository, RepositoryId } from '@/domain/projects';
import { ProjectNotFoundException } from '../exceptions';
import { aggregateToDto } from '../helpers';

export type FindProjectByRepoIdQuery = {
	repositoryId: number;
};

export class FindProjectByRepoIdHandler
	implements IQueryHandler<FindProjectByRepoIdQuery, ProjectDto>
{
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(command: FindProjectByRepoIdQuery): Promise<ProjectDto> {
		const repositoryId = RepositoryId.create(command.repositoryId);
		const project =
			await this.projectRepository.findByRepositoryId(repositoryId);

		if (!project) {
			throw new ProjectNotFoundException('');
		}

		return aggregateToDto(project);
	}
}
