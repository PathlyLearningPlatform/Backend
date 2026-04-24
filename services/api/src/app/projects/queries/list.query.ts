import { IQueryHandler, OffsetPagination } from '@/app/common';
import { ProjectDto } from '../dtos';
import { IProjectRepository } from '@/domain/projects';
import { aggregateToDto } from '../helpers';

export type ListProjectsQuery = Partial<{
	options: Partial<OffsetPagination>;
}>;

export class ListProjectsHandler
	implements IQueryHandler<ListProjectsQuery, ProjectDto[]>
{
	constructor(private readonly projectRepository: IProjectRepository) {}

	async execute(command: ListProjectsQuery): Promise<ProjectDto[]> {
		const projects = await this.projectRepository.list(command);

		return projects.map(aggregateToDto);
	}
}
