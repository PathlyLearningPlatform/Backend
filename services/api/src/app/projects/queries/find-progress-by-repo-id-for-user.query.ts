import { IQueryHandler } from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import { IProjectProgressRepository, RepositoryId } from '@/domain/projects';
import { ProjectProgressNotFoundException } from '../exceptions';
import { progressAggregateToDto } from '../helpers';
import { ProjectProgressDto } from '../dtos';

export type FindProjectProgressByRepoIdForUserQuery = {
	userId: string;
	repositoryId: number;
};

export class FindProjectProgressByRepoIdForUserHandler
	implements
		IQueryHandler<FindProjectProgressByRepoIdForUserQuery, ProjectProgressDto>
{
	constructor(
		private readonly progressRepository: IProjectProgressRepository,
	) {}

	async execute(
		command: FindProjectProgressByRepoIdForUserQuery,
	): Promise<ProjectProgressDto> {
		const userId = UserId.create(UUID.create(command.userId));
		const repositoryId = RepositoryId.create(command.repositoryId);

		const progress = await this.progressRepository.findByRepositoryIdForUser(
			repositoryId,
			userId,
		);

		if (!progress) {
			throw new ProjectProgressNotFoundException('', userId.toString());
		}

		return progressAggregateToDto(progress);
	}
}
