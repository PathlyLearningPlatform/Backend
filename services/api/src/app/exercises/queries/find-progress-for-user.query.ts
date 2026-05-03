import { IQueryHandler } from '@/app/common';
import { ExerciseProgressDto } from '../dtos';
import {
	IExerciseProgressRepository,
	ExerciseId,
	ExerciseProgressId,
} from '@/domain/exercises';
import { UserId, UUID } from '@/domain/common';
import { ExerciseProgressNotFoundException } from '../exceptions';
import { progressAggregateToDto } from '../helpers';

export type FindExerciseProgressForUserQuery = {
	userId: string;
	exerciseId: string;
};

export class FindExerciseProgressForUserHandler
	implements
		IQueryHandler<FindExerciseProgressForUserQuery, ExerciseProgressDto>
{
	constructor(
		private readonly exerciseProgressRepository: IExerciseProgressRepository,
	) {}

	async execute(
		command: FindExerciseProgressForUserQuery,
	): Promise<ExerciseProgressDto> {
		const exerciseId = ExerciseId.create(UUID.create(command.exerciseId));
		const userId = UserId.create(UUID.create(command.userId));

		const progressId = ExerciseProgressId.create(exerciseId, userId);
		const progress = await this.exerciseProgressRepository.findById(progressId);

		if (!progress) {
			throw new ExerciseProgressNotFoundException(
				progressId.exerciseId.primitive(),
				progressId.userId.toString(),
			);
		}

		return progressAggregateToDto(progress);
	}
}
