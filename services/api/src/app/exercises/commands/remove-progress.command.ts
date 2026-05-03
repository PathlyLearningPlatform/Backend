import { ICommandHandler } from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import {
	IExerciseProgressRepository,
	ExerciseId,
	ExerciseProgressId,
} from '@/domain/exercises';
import { ExerciseProgressNotFoundException } from '../exceptions';

export type RemoveExerciseProgressCommand = {
	exerciseId: string;
	userId: string;
};

export class RemoveExerciseProgressHandler
	implements ICommandHandler<RemoveExerciseProgressCommand, void>
{
	constructor(
		private readonly exerciseProgressRepository: IExerciseProgressRepository,
	) {}

	async execute(command: RemoveExerciseProgressCommand): Promise<void> {
		const exerciseId = ExerciseId.create(UUID.create(command.exerciseId));
		const userId = UserId.create(UUID.create(command.userId));

		const progressId = ExerciseProgressId.create(exerciseId, userId);
		const wasRemoved = await this.exerciseProgressRepository.remove(progressId);

		if (!wasRemoved) {
			throw new ExerciseProgressNotFoundException(
				command.exerciseId,
				progressId.userId.toString(),
			);
		}
	}
}
