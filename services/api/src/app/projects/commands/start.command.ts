import { ICommandHandler } from '@/app/common';
import { ProjectProgressDto } from '../dtos';
import {
	IProjectProgressRepository,
	IProjectRepository,
	ProjectId,
	ProjectProgress,
	ProjectProgressId,
	RepositoryId,
} from '@/domain/projects';
import { Url, UserId, UUID } from '@/domain/common';
import { ProjectNotFoundException } from '../exceptions';
import { progressAggregateToDto } from '../helpers';

export type StartProjectCommand = {
	projectId: string;
	userId: string;
	repositoryUrl: string;
	repositoryId: number;
};

export class StartProjectHandler
	implements ICommandHandler<StartProjectCommand, ProjectProgressDto>
{
	constructor(
		private readonly projectProgressRepository: IProjectProgressRepository,
		private readonly projectRepository: IProjectRepository,
	) {}

	async execute(command: StartProjectCommand): Promise<ProjectProgressDto> {
		const userId = UserId.create(UUID.create(command.userId));
		// TODO: check if user exists

		const projectId = ProjectId.create(UUID.create(command.projectId));
		const project = await this.projectRepository.findById(projectId);

		if (!project) {
			throw new ProjectNotFoundException(projectId.value);
		}

		const progressId = ProjectProgressId.create(projectId, userId);
		const progress = ProjectProgress.create(progressId, {
			repositoryUrl: Url.create(command.repositoryUrl),
			repositoryId: RepositoryId.create(command.repositoryId),
		});

		await this.projectProgressRepository.save(progress);

		return progressAggregateToDto(progress);
	}
}
