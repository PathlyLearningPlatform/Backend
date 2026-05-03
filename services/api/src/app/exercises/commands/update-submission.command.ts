import { ICommandHandler } from '@/app/common';
import {
	IExerciseProgressRepository,
	IExerciseSubmissionRepository,
	ExerciseId,
	ExerciseProgressId,
	ExerciseSubmissionId,
	ExerciseSubmissionStatus,
	ExerciseSubmissionConclusion,
} from '@/domain/exercises';
import { ExerciseSubmissionDto } from '../dtos';
import { UserId, UUID } from '@/domain/common';
import {
	ExerciseProgressNotFoundException,
	ExerciseSubmissionNotFoundException,
} from '../exceptions';
import { submissionAggregateToDto } from '../helpers';

export type UpdateExerciseSubmissionCommand = {
	where: {
		submissionId: string;
		exerciseId: string;
		userId: string;
	};
	fields: Partial<{
		status: ExerciseSubmissionStatus;
		conclusion: ExerciseSubmissionConclusion;
	}>;
};

export class UpdateExerciseSubmissionHandler
	implements
		ICommandHandler<UpdateExerciseSubmissionCommand, ExerciseSubmissionDto>
{
	constructor(
		private readonly exerciseSubmissionRepository: IExerciseSubmissionRepository,
		private readonly exerciseProgressRepository: IExerciseProgressRepository,
	) {}

	async execute(
		command: UpdateExerciseSubmissionCommand,
	): Promise<ExerciseSubmissionDto> {
		const exerciseId = ExerciseId.create(UUID.create(command.where.exerciseId));
		const userId = UserId.create(UUID.create(command.where.userId));

		const submissionId = ExerciseSubmissionId.create(
			UUID.create(command.where.submissionId),
		);

		const submission = await this.exerciseSubmissionRepository.findFirst({
			exerciseId: exerciseId.primitive(),
			userId: userId.toString(),
			submissionId: submissionId.value.value,
		});

		if (!submission) {
			throw new ExerciseSubmissionNotFoundException(submissionId.value.value);
		}

		const progressId = ExerciseProgressId.create(exerciseId, userId);
		const progress = await this.exerciseProgressRepository.findById(progressId);

		if (!progress) {
			throw new ExerciseProgressNotFoundException(
				exerciseId.primitive(),
				userId.toString(),
			);
		}

		submission.update(new Date(), {
			status: command.fields.status,
			conclusion: command.fields.conclusion,
		});

		if (submission.status === ExerciseSubmissionStatus.COMPLETED) {
			progress.complete(new Date());
		}

		await this.exerciseSubmissionRepository.save(submission);
		await this.exerciseProgressRepository.save(progress);

		return submissionAggregateToDto(submission);
	}
}
