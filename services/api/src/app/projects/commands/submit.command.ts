import { ICommandHandler } from '@/app/common';
import { ProjectSubmissionDto } from '../dtos';
import {
	IProjectProgressRepository,
	IProjectRepository,
	IProjectSubmissionRepository,
	ProjectId,
	ProjectProgressId,
	ProjectSubmission,
	ProjectSubmissionId,
} from '@/domain/projects';
import { UserId, UUID } from '@/domain/common';
import {
	ProjectNotFoundException,
	ProjectProgressNotFoundException,
} from '../exceptions';
import { randomUUID } from 'crypto';
import { submissionAggregateToDto } from '../helpers';

export type SubmitProjectCommand = {
	projectId: string;
	userId: string;
	commitSha: string;
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
		const userId = UserId.create(UUID.create(command.userId));
		// TODO: check if user exists

		const projectId = ProjectId.create(UUID.create(command.projectId));
		const project = await this.projectRepository.findById(projectId);

		if (!project) {
			throw new ProjectNotFoundException(projectId.value);
		}

		const progressId = ProjectProgressId.create(projectId, userId);
		const progress = await this.projectProgressRepository.findById(progressId);

		if (!progress) {
			throw new ProjectProgressNotFoundException(
				projectId.value,
				userId.toString(),
			);
		}

		const submissionId = ProjectSubmissionId.create(UUID.create(randomUUID()));
		const submission = ProjectSubmission.create(submissionId, {
			projectId: projectId,
			userId: userId,
			submittedAt: new Date(),
			commitSha: command.commitSha,
		});

		await this.projectSubmissionRepository.save(submission);

		return submissionAggregateToDto(submission);
	}
}
