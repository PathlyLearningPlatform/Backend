import { IQueryHandler, OffsetPagination } from '@/app/common';
import {
	IExerciseProgressRepository,
	ExerciseStatus,
} from '@/domain/exercises';
import { ExerciseProgressDto } from '../dtos';
import { progressAggregateToDto } from '../helpers';

export type ListExerciseProgressQuery = Partial<{
	options: Partial<OffsetPagination>;
	where: Partial<{
		exerciseId: string;
		userId: string;
		status: ExerciseStatus;
	}>;
}>;

export class ListExerciseProgressHandler
	implements IQueryHandler<ListExerciseProgressQuery, ExerciseProgressDto[]>
{
	constructor(
		private readonly exerciseProgressRepository: IExerciseProgressRepository,
	) {}

	async execute(
		command: ListExerciseProgressQuery,
	): Promise<ExerciseProgressDto[]> {
		const exerciseProgress =
			await this.exerciseProgressRepository.list(command);

		return exerciseProgress.map(progressAggregateToDto);
	}
}
