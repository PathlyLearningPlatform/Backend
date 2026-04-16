import { ActivityNotFoundException, type IQueryHandler } from '@/app/common';
import { ActivityId, IActivityRepository } from '@/domain/activities';
import type { ExerciseDto } from '../dtos';
import { exerciseAggregateToDto } from '../helpers';

type FindExerciseByIdQuery = {
	where: {
		id: string;
	};
};
type FindExerciseByIdResult = ExerciseDto;

export class FindExerciseByIdHandler
	implements IQueryHandler<FindExerciseByIdQuery, FindExerciseByIdResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(query: FindExerciseByIdQuery): Promise<FindExerciseByIdResult> {
		const activityId = ActivityId.create(query.where.id);
		const exercise = await this.activityRepository.findExerciseById(activityId);

		if (!exercise) {
			throw new ActivityNotFoundException(query.where.id);
		}

		return exerciseAggregateToDto(exercise);
	}
}
