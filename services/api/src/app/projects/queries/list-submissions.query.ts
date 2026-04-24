import { IQueryHandler, OffsetPagination } from '@/app/common';
import { ProjectSubmissionDto } from '../dtos';
import {
	IProjectSubmissionRepository,
	ProjectId,
	ProjectSubmissionStatus,
} from '@/domain/projects';
import { UserId, UUID } from '@/domain/common';
import { submissionAggregateToDto } from '../helpers';

export type ListProjectSubmissionsQuery = Partial<{
	options: Partial<OffsetPagination>;
	where: Partial<{
		userId: string;
		projectId: string;
		status: ProjectSubmissionStatus;
	}>;
}>;

export class ListProjectSubmissionsHandler
	implements IQueryHandler<ListProjectSubmissionsQuery, ProjectSubmissionDto[]>
{
	constructor(
		private readonly projectSubmissionRepository: IProjectSubmissionRepository,
	) {}

	async execute(
		command: ListProjectSubmissionsQuery,
	): Promise<ProjectSubmissionDto[]> {
		const projectId = command.where?.projectId
			? ProjectId.create(UUID.create(command.where.projectId))
			: undefined;
		const userId = command.where?.userId
			? UserId.create(UUID.create(command.where.userId))
			: undefined;

		const projectSubmissions = await this.projectSubmissionRepository.list({
			options: command.options,
			where: {
				projectId,
				status: command.where?.status,
				userId,
			},
		});

		return projectSubmissions.map(submissionAggregateToDto);
	}
}
