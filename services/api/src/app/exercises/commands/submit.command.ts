import { ICommandHandler } from '@/app/common';
import { ExerciseSubmissionDto } from '../dtos';
import {
	IExerciseProgressRepository,
	IExerciseRepository,
	IExerciseSubmissionRepository,
	ExerciseId,
	ExerciseProgressId,
	ExerciseSubmission,
	ExerciseSubmissionId,
} from '@/domain/exercises';
import { UserId, UUID } from '@/domain/common';
import {
	ExerciseNotFoundException,
	ExerciseProgressNotFoundException,
} from '../exceptions';
import { randomUUID } from 'crypto';
import { submissionAggregateToDto } from '../helpers';

export type SubmitExerciseCommand = {
	exerciseId: string;
	userId: string;
	commitSha: string;
};

export class SubmitExerciseHandler
	implements ICommandHandler<SubmitExerciseCommand, ExerciseSubmissionDto>
{
	constructor(
		private readonly exerciseRepository: IExerciseRepository,
		private readonly exerciseProgressRepository: IExerciseProgressRepository,
		private readonly exerciseSubmissionRepository: IExerciseSubmissionRepository,
	) {}

	async execute(
		command: SubmitExerciseCommand,
	): Promise<ExerciseSubmissionDto> {
		const userId = UserId.create(UUID.create(command.userId));
		// TODO: check if user exists

		const exerciseId = ExerciseId.create(UUID.create(command.exerciseId));
		const exercise = await this.exerciseRepository.findById(exerciseId);

		if (!exercise) {
			throw new ExerciseNotFoundException(exerciseId.primitive());
		}

		const progressId = ExerciseProgressId.create(exerciseId, userId);
		const progress = await this.exerciseProgressRepository.findById(progressId);

		if (!progress) {
			throw new ExerciseProgressNotFoundException(
				exerciseId.primitive(),
				userId.toString(),
			);
		}

		const submissionId = ExerciseSubmissionId.create(UUID.create(randomUUID()));
		const submission = ExerciseSubmission.create(submissionId, {
			exerciseId: exerciseId,
			userId: userId,
			submittedAt: new Date(),
			commitSha: command.commitSha,
		});

		await this.exerciseSubmissionRepository.save(submission);

		return submissionAggregateToDto(submission);
	}
}
