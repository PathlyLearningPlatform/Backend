import { type IQueryHandler } from '@/app/common';
import type { ExerciseDto } from '../dtos';
import { aggregateToDto } from '../helpers';
import { IExerciseRepository } from '@/domain/exercises/repositories';
import { ExerciseNotFoundException } from '../exceptions';
import { ExerciseId } from '@/domain/exercises';
import { UUID } from '@/domain/common';

type FindExerciseByIdQuery = {
	where: {
		id: string;
	};
};
type FindExerciseByIdResult = ExerciseDto;

export class FindExerciseByIdHandler
	implements IQueryHandler<FindExerciseByIdQuery, FindExerciseByIdResult>
{
	constructor(private readonly exerciseRepository: IExerciseRepository) {}

	async execute(query: FindExerciseByIdQuery): Promise<FindExerciseByIdResult> {
		const exerciseId = ExerciseId.create(UUID.create(query.where.id));
		const exercise = await this.exerciseRepository.findById(exerciseId);

		if (!exercise) {
			throw new ExerciseNotFoundException(query.where.id);
		}

		return aggregateToDto(exercise);
	}
}
