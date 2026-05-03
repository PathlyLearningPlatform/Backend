import { randomUUID } from 'node:crypto';
import type { ExerciseDto } from '../dtos';
import { type ICommandHandler } from '@/app/common';
import { Exercise } from '@/domain/exercises/exercise.aggregate';
import {
	ExerciseDifficulty,
	ExerciseId,
} from '@/domain/exercises/value-objects';
import { IExerciseRepository } from '@/domain/exercises/repositories';
import { RepositoryId, Url, UUID } from '@/domain/common';
import { aggregateToDto } from '../helpers';

type CreateExerciseCommand = {
	name: string;
	description?: string;
	difficulty: ExerciseDifficulty;
	acceptUrl: string;
	repositoryId: number;
};
type CreateExerciseResult = ExerciseDto;

export class CreateExerciseHandler
	implements ICommandHandler<CreateExerciseCommand, CreateExerciseResult>
{
	constructor(private readonly exerciseRepository: IExerciseRepository) {}

	async execute(command: CreateExerciseCommand): Promise<CreateExerciseResult> {
		const exerciseId = ExerciseId.create(UUID.create(randomUUID()));

		const exercise = Exercise.create(exerciseId, {
			createdAt: new Date(),
			name: command.name,
			description: command.description,
			difficulty: command.difficulty,
			acceptUrl: Url.create(command.acceptUrl),
			repositoryId: RepositoryId.create(command.repositoryId),
		});

		await this.exerciseRepository.save(exercise);

		return aggregateToDto(exercise);
	}
}
