import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { ExerciseDto } from '../dtos';
import { aggregateToDto } from '../helpers';
import { IExerciseRepository } from '@/domain/exercises/repositories';

type ListExercisesQuery = {
	options?: OffsetPagination;
};
type ListExercisesResult = ExerciseDto[];

export class ListExercisesHandler
	implements IQueryHandler<ListExercisesQuery, ListExercisesResult>
{
	constructor(private readonly exerciseRepository: IExerciseRepository) {}

	async execute(query: ListExercisesQuery): Promise<ListExercisesResult> {
		const exercises = await this.exerciseRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return exercises.map(aggregateToDto);
	}
}
