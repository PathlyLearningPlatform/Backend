import { ICommandHandler } from '@/app/common';
import { ProjectSubmissionDto } from '../dtos';
import {
	IProjectProgressRepository,
	IProjectRepository,
	IProjectSubmissionRepository,
	ProjectId,
	ProjectProgress,
	ProjectProgressId,
	ProjectSubmission,
	ProjectSubmissionId,
} from '@/domain/projects';
import { UserId, UUID } from '@/domain/common';
import { ProjectNotFoundException } from '../exceptions';
import { randomUUID } from 'crypto';
import { submissionAggregateToDto } from '../helpers';

export type SubmitProjectCommand = {
	projectId: string;
	userId: string;
};

export class SubmitProjectHandler
	implements ICommandHandler<SubmitProjectCommand, ProjectSubmissionDto>
{
	constructor(
		private readonly projectRepository: IProjectRepository,
		private readonly projectProgressRepository: IProjectProgressRepository,
		private readonly projectSubmissionRepository: IProjectSubmissionRepository,
	) {}

	async execute(command: SubmitProjectCommand): Promise<ProjectSubmissionDto> {
		// TODO: check if user exists
		const userId = UserId.create(UUID.create(command.userId));

		const projectId = ProjectId.create(UUID.create(command.projectId));
		const project = await this.projectRepository.findById(projectId);

		if (!project) {
			throw new ProjectNotFoundException(projectId.value);
		}

		const submissionId = ProjectSubmissionId.create(UUID.create(randomUUID()));
		const submission = ProjectSubmission.create(submissionId, {
			projectId: projectId,
			userId: userId,
			submittedAt: new Date(),
		});

		const progressId = ProjectProgressId.create(projectId, userId);
		const progress = ProjectProgress.create(progressId);

		await this.projectSubmissionRepository.save(submission);
		await this.projectProgressRepository.save(progress);

		return submissionAggregateToDto(submission);
	}
}
