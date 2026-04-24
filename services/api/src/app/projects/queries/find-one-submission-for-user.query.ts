import { IQueryHandler } from '@/app/common';
import { ProjectSubmissionDto } from '../dtos';
import {
	IProjectSubmissionRepository,
	ProjectSubmissionId,
} from '@/domain/projects';
import { UUID } from '@/domain/common';
import { ProjectSubmissionNotFoundException } from '../exceptions';
import { submissionAggregateToDto } from '../helpers';

export type FindOneProjectSubmissionForUserQuery = {
	projectId: string;
	userId: string;
	submissionId: string;
};

export class FindOneProjectSubmissionForUserHandler
	implements
		IQueryHandler<FindOneProjectSubmissionForUserQuery, ProjectSubmissionDto>
{
	constructor(
		private readonly projectSubmissionRepository: IProjectSubmissionRepository,
	) {}

	async execute(
		command: FindOneProjectSubmissionForUserQuery,
	): Promise<ProjectSubmissionDto> {
		const submissionId = ProjectSubmissionId.create(
			UUID.create(command.submissionId),
		);

		const submission =
			await this.projectSubmissionRepository.findFirst(command);

		if (!submission) {
			throw new ProjectSubmissionNotFoundException(submissionId.value);
		}

		return submissionAggregateToDto(submission);
	}
}
