import { IQueryHandler, OffsetPagination } from '@/app/common';
import { ExerciseSubmissionDto } from '../dtos';
import {
	IExerciseSubmissionRepository,
	ExerciseId,
	ExerciseSubmissionStatus,
} from '@/domain/exercises';
import { UserId, UUID } from '@/domain/common';
import { submissionAggregateToDto } from '../helpers';

export type ListExerciseSubmissionsQuery = Partial<{
	options: Partial<OffsetPagination>;
	where: Partial<{
		userId: string;
		exerciseId: string;
		status: ExerciseSubmissionStatus;
	}>;
}>;

export class ListExerciseSubmissionsHandler
	implements
		IQueryHandler<ListExerciseSubmissionsQuery, ExerciseSubmissionDto[]>
{
	constructor(
		private readonly exerciseSubmissionRepository: IExerciseSubmissionRepository,
	) {}

	async execute(
		command: ListExerciseSubmissionsQuery,
	): Promise<ExerciseSubmissionDto[]> {
		const exerciseId = command.where?.exerciseId
			? ExerciseId.create(UUID.create(command.where.exerciseId))
			: undefined;
		const userId = command.where?.userId
			? UserId.create(UUID.create(command.where.userId))
			: undefined;

		const exerciseSubmissions = await this.exerciseSubmissionRepository.list({
			options: command.options,
			where: {
				exerciseId,
				status: command.where?.status,
				userId,
			},
		});

		return exerciseSubmissions.map(submissionAggregateToDto);
	}
}
