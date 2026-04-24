import { ICommandHandler } from '@/app/common';
import {
	IProjectProgressRepository,
	IProjectSubmissionRepository,
	ProjectId,
	ProjectProgressId,
	ProjectSubmissionId,
	ProjectSubmissionStatus,
} from '@/domain/projects';
import { ProjectSubmissionDto } from '../dtos';
import { UserId, UUID } from '@/domain/common';
import {
	ProjectProgressNotFoundException,
	ProjectSubmissionNotFoundException,
} from '../exceptions';
import { submissionAggregateToDto } from '../helpers';

export type UpdateProjectSubmissionCommand = {
	where: {
		submissionId: string;
		projectId: string;
		userId: string;
	};
	fields: Partial<{
		status: ProjectSubmissionStatus;
	}>;
};

export class UpdateProjectSubmissionHandler
	implements
		ICommandHandler<UpdateProjectSubmissionCommand, ProjectSubmissionDto>
{
	constructor(
		private readonly projectSubmissionRepository: IProjectSubmissionRepository,
		private readonly projectProgressRepository: IProjectProgressRepository,
	) {}

	async execute(
		command: UpdateProjectSubmissionCommand,
	): Promise<ProjectSubmissionDto> {
		const projectId = ProjectId.create(UUID.create(command.where.projectId));
		const userId = UserId.create(UUID.create(command.where.userId));

		const submissionId = ProjectSubmissionId.create(
			UUID.create(command.where.submissionId),
		);

		const submission = await this.projectSubmissionRepository.findFirst({
			projectId: projectId.value,
			userId: userId.toString(),
			submissionId: submissionId.value,
		});

		if (!submission) {
			throw new ProjectSubmissionNotFoundException(submissionId.value);
		}

		const progressId = ProjectProgressId.create(projectId, userId);
		const progress = await this.projectProgressRepository.findById(progressId);

		if (!progress) {
			throw new ProjectProgressNotFoundException(
				projectId.value,
				userId.toString(),
			);
		}

		if (command.fields.status) {
			const status = command.fields.status;

			submission.changeStatus(new Date(), status);

			if (status === ProjectSubmissionStatus.COMPLETED) {
				progress.complete(new Date());
			}
		}

		await this.projectSubmissionRepository.save(submission);
		await this.projectProgressRepository.save(progress);

		return submissionAggregateToDto(submission);
	}
}
