import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { ExerciseDto } from '../dtos';
import { IActivityRepository } from '@/domain/activities';
import { aggregateToDto } from '../helpers';

type ListExercisesQuery = {
	where?: {
		lessonId?: string;
	};
	options?: OffsetPagination;
};
type ListExercisesResult = ExerciseDto[];

export class ListExercisesHandler
	implements IQueryHandler<ListExercisesQuery, ListExercisesResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(query: ListExercisesQuery): Promise<ListExercisesResult> {
		const exercises = await this.activityRepository.listExercises({
			where: {
				lessonId: query.where?.lessonId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return exercises.map(aggregateToDto);
	}
}
