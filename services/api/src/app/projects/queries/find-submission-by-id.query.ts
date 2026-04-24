import { IQueryHandler } from '@/app/common';
import { ProjectSubmissionDto } from '../dtos';
import {
	IProjectSubmissionRepository,
	ProjectSubmissionId,
} from '@/domain/projects';
import { UUID } from '@/domain/common';
import { ProjectSubmissionNotFoundException } from '../exceptions';
import { submissionAggregateToDto } from '../helpers';

export type FindProjectSubmissionByIdQuery = {
	id: string;
};

export class FindProjectSubmissionByIdHandler
	implements IQueryHandler<FindProjectSubmissionByIdQuery, ProjectSubmissionDto>
{
	constructor(
		private readonly projectSubmissionRepository: IProjectSubmissionRepository,
	) {}

	async execute(
		command: FindProjectSubmissionByIdQuery,
	): Promise<ProjectSubmissionDto> {
		const submissionId = ProjectSubmissionId.create(UUID.create(command.id));
		const submission =
			await this.projectSubmissionRepository.findById(submissionId);

		if (!submission) {
			throw new ProjectSubmissionNotFoundException(submissionId.value);
		}

		return submissionAggregateToDto(submission);
	}
}
