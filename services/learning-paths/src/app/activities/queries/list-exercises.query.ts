import type { IQueryHandler, OffsetPagination } from "@/app/common";
import type { ExerciseDto } from "../dtos";
import type { IActivityReadRepository } from "../interfaces";

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
