import { ICommandHandler } from '@/app/common';
import { IExerciseRepository, ExerciseId } from '@/domain/exercises';
import { UUID } from '@/domain/common';
import { ExerciseNotFoundException } from '../exceptions';

export type RemoveExerciseCommand = {
	id: string;
};

export class RemoveExerciseHandler
	implements ICommandHandler<RemoveExerciseCommand, void>
{
	constructor(private readonly exerciseRepository: IExerciseRepository) {}

	async execute(command: RemoveExerciseCommand): Promise<void> {
		const id = ExerciseId.create(UUID.create(command.id));
		const wasRemoved = await this.exerciseRepository.remove(id);

		if (!wasRemoved) {
			throw new ExerciseNotFoundException(id.primitive());
		}
	}
}
