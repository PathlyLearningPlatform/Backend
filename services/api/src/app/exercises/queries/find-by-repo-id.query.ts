import { IQueryHandler } from '@/app/common';
import { ExerciseDto } from '../dtos';
import { IExerciseRepository } from '@/domain/exercises';
import { ExerciseNotFoundException } from '../exceptions';
import { aggregateToDto } from '../helpers';
import { RepositoryId } from '@/domain/common';

export type FindExerciseByRepoIdQuery = {
	repositoryId: number;
};

export class FindExerciseByRepoIdHandler
	implements IQueryHandler<FindExerciseByRepoIdQuery, ExerciseDto>
{
	constructor(private readonly exerciseRepository: IExerciseRepository) {}

	async execute(command: FindExerciseByRepoIdQuery): Promise<ExerciseDto> {
		const repositoryId = RepositoryId.create(command.repositoryId);
		const exercise =
			await this.exerciseRepository.findByRepositoryId(repositoryId);

		if (!exercise) {
			throw new ExerciseNotFoundException('');
		}

		return aggregateToDto(exercise);
	}
}
