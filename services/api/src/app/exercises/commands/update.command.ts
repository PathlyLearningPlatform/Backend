import { type ICommandHandler } from '@/app/common';
import {
	ExerciseId,
	type ExerciseDifficulty,
} from '@/domain/exercises/value-objects';
import type { ExerciseDto } from '../dtos';
import { IExerciseRepository } from '@/domain/exercises/repositories';
import { UUID } from '@/domain/common';
import { aggregateToDto } from '../helpers';
import { ExerciseNotFoundException } from '../exceptions';

type UpdateExerciseCommand = {
	where: {
		id: string;
	};
	props?: {
		name?: string;
		description?: string | null;
		difficulty?: ExerciseDifficulty;
	};
};
type UpdateExerciseResult = ExerciseDto;

export class UpdateExerciseHandler
	implements ICommandHandler<UpdateExerciseCommand, UpdateExerciseResult>
{
	constructor(private readonly exerciseRepository: IExerciseRepository) {}

	async execute(command: UpdateExerciseCommand): Promise<UpdateExerciseResult> {
		const id = ExerciseId.create(UUID.create(command.where.id));
		const exercise = await this.exerciseRepository.findById(id);

		if (!exercise) {
			throw new ExerciseNotFoundException(id.primitive());
		}

		exercise.update(new Date(), {
			name: command.props?.name,
			description: command.props?.description,
			difficulty: command.props?.difficulty,
		});

		await this.exerciseRepository.save(exercise);

		return aggregateToDto(exercise);
	}
}
