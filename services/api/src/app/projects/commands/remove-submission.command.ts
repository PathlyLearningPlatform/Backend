import { ICommandHandler } from '@/app/common';
import { UUID } from '@/domain/common';
import {
	IProjectSubmissionRepository,
	ProjectSubmissionId,
} from '@/domain/projects';
import { ProjectSubmissionNotFoundException } from '../exceptions';

export type RemoveProjectSubmissionCommand = {
	submissionId: string;
	projectId: string;
	userId: string;
};

export class RemoveProjectSubmissionHandler
	implements ICommandHandler<RemoveProjectSubmissionCommand, void>
{
	constructor(
		private readonly projectSubmissionRepository: IProjectSubmissionRepository,
	) {}

	async execute(command: RemoveProjectSubmissionCommand): Promise<void> {
		const submissionId = ProjectSubmissionId.create(
			UUID.create(command.submissionId),
		);
		const submission = await this.projectSubmissionRepository.findFirst({
			projectId: command.projectId,
			userId: command.userId,
			submissionId: command.submissionId,
		});

		if (!submission) {
			throw new ProjectSubmissionNotFoundException(submissionId.value);
		}

		await this.projectSubmissionRepository.remove(submissionId);
	}
}
