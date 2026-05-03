import { ICommandHandler } from '@/app/common';
import { UUID } from '@/domain/common';
import {
	IExerciseSubmissionRepository,
	ExerciseSubmissionId,
} from '@/domain/exercises';
import { ExerciseSubmissionNotFoundException } from '../exceptions';

export type RemoveExerciseSubmissionCommand = {
	submissionId: string;
	exerciseId: string;
	userId: string;
};

export class RemoveExerciseSubmissionHandler
	implements ICommandHandler<RemoveExerciseSubmissionCommand, void>
{
	constructor(
		private readonly exerciseSubmissionRepository: IExerciseSubmissionRepository,
	) {}

	async execute(command: RemoveExerciseSubmissionCommand): Promise<void> {
		const submissionId = ExerciseSubmissionId.create(
			UUID.create(command.submissionId),
		);
		const submission = await this.exerciseSubmissionRepository.findFirst({
			exerciseId: command.exerciseId,
			userId: command.userId,
			submissionId: command.submissionId,
		});

		if (!submission) {
			throw new ExerciseSubmissionNotFoundException(command.submissionId);
		}

		await this.exerciseSubmissionRepository.remove(submissionId);
	}
}
