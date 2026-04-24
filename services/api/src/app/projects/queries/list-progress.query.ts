import { IQueryHandler, OffsetPagination } from '@/app/common';
import { IProjectProgressRepository, ProjectStatus } from '@/domain/projects';
import { ProjectProgressDto } from '../dtos';
import { progressAggregateToDto } from '../helpers';

export type ListProjectProgressQuery = Partial<{
	options: Partial<OffsetPagination>;
	where: Partial<{
		projectId: string;
		userId: string;
		status: ProjectStatus;
	}>;
}>;

export class ListProjectProgressHandler
	implements IQueryHandler<ListProjectProgressQuery, ProjectProgressDto[]>
{
	constructor(
		private readonly projectProgressRepository: IProjectProgressRepository,
	) {}

	async execute(
		command: ListProjectProgressQuery,
	): Promise<ProjectProgressDto[]> {
		const projectProgress = await this.projectProgressRepository.list(command);

		return projectProgress.map(progressAggregateToDto);
	}
}
