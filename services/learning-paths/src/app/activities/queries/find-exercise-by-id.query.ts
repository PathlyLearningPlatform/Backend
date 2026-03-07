import { IQueryHandler, ActivityNotFoundException } from '@/app/common';
import { IActivityReadRepository } from '../interfaces';
import { ExerciseDto } from '../dtos';

type FindExerciseByIdQuery = {
	where: {
		id: string;
	};
};
type FindExerciseByIdResult = ExerciseDto;

export class FindExerciseByIdHandler
	implements IQueryHandler<FindExerciseByIdQuery, FindExerciseByIdResult>
{
	constructor(
		private readonly activityReadRepository: IActivityReadRepository,
	) {}

	async execute(query: FindExerciseByIdQuery): Promise<FindExerciseByIdResult> {
		const exercise = await this.activityReadRepository.findExerciseById(
			query.where.id,
		);

		if (!exercise) {
			throw new ActivityNotFoundException(query.where.id);
		}

		return exercise;
	}
}
