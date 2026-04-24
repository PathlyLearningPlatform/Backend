import { IQueryHandler } from '@/app/common';
import { ProjectProgressDto } from '../dtos';
import {
	IProjectProgressRepository,
	ProjectId,
	ProjectProgressId,
} from '@/domain/projects';
import { UserId, UUID } from '@/domain/common';
import { ProjectProgressNotFoundException } from '../exceptions';
import { progressAggregateToDto } from '../helpers';

export type FindOneProjectProgressForUserQuery = {
	userId: string;
	projectId: string;
};

export class FindOneProjectProgressForUserHandler
	implements
		IQueryHandler<FindOneProjectProgressForUserQuery, ProjectProgressDto>
{
	constructor(
		private readonly projectProgressRepository: IProjectProgressRepository,
	) {}

	async execute(
		command: FindOneProjectProgressForUserQuery,
	): Promise<ProjectProgressDto> {
		const projectId = ProjectId.create(UUID.create(command.projectId));
		const userId = UserId.create(UUID.create(command.userId));

		const progressId = ProjectProgressId.create(projectId, userId);
		const progress = await this.projectProgressRepository.findById(progressId);

		if (!progress) {
			throw new ProjectProgressNotFoundException(
				progressId.projectId.value,
				progressId.userId.toString(),
			);
		}

		return progressAggregateToDto(progress);
	}
}
