import { IQueryHandler } from '@/app/common';
import { ProjectSubmissionDto } from '../dtos';
import { IProjectSubmissionRepository } from '@/domain/projects';
import { ProjectSubmissionNotFoundException } from '../exceptions';
import { submissionAggregateToDto } from '../helpers';

export type FindProjectSubmissionByCommitShaQuery = {
	commitSha: string;
};

export class FindProjectSubmissionByCommitShaHandler
	implements
		IQueryHandler<FindProjectSubmissionByCommitShaQuery, ProjectSubmissionDto>
{
	constructor(
		private readonly projectSubmissionRepository: IProjectSubmissionRepository,
	) {}

	async execute(
		command: FindProjectSubmissionByCommitShaQuery,
	): Promise<ProjectSubmissionDto> {
		const submission = await this.projectSubmissionRepository.findFirst({
			commitSha: command.commitSha,
		});

		if (!submission) {
			throw new ProjectSubmissionNotFoundException('');
		}

		return submissionAggregateToDto(submission);
	}
}
