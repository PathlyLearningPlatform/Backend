import { IQueryHandler, OffsetPagination } from '@/app/common';
import { IActivityReadRepository } from '../interfaces';
import { ExerciseDto } from '../dtos';

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
	constructor(
		private readonly activityReadRepository: IActivityReadRepository,
	) {}

	async execute(query: ListExercisesQuery): Promise<ListExercisesResult> {
		return this.activityReadRepository.listExercises({
			where: {
				lessonId: query.where?.lessonId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});
	}
}
