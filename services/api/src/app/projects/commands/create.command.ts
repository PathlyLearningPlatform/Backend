import { ICommandHandler } from '@/app/common';
import { ProjectDto } from '../dtos';
import { IProjectRepository, Project, ProjectId } from '@/domain/projects';
import { Url, UUID, RepositoryId } from '@/domain/common';
import { randomUUID } from 'crypto';
import { aggregateToDto } from '../helpers';

export type CreateProjectCommand = {
	name: string;
	description?: string;
	acceptUrl: string;
	repositoryId: number;
};

export class CreateProjectHandler
	implements ICommandHandler<CreateProjectCommand, ProjectDto>
{
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(command: CreateProjectCommand): Promise<ProjectDto> {
		const id = ProjectId.create(UUID.create(randomUUID()));
		const project = Project.create(id, {
			createdAt: new Date(),
			name: command.name,
			description: command.description,
			acceptUrl: Url.create(command.acceptUrl),
			repositoryId: RepositoryId.create(command.repositoryId),
		});

		await this.projectRepository.save(project);

		return aggregateToDto(project);
	}
}
