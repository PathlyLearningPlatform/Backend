import { IQueryHandler } from '@/app/common';
import { UserId, UUID, RepositoryId } from '@/domain/common';
import { IExerciseProgressRepository } from '@/domain/exercises';
import { ExerciseProgressNotFoundException } from '../exceptions';
import { progressAggregateToDto } from '../helpers';
import { ExerciseProgressDto } from '../dtos';

export type FindExerciseProgressByRepoIdForUserQuery = {
	userId: string;
	repositoryId: number;
};

export class FindExerciseProgressByRepoIdForUserHandler
	implements
		IQueryHandler<FindExerciseProgressByRepoIdForUserQuery, ExerciseProgressDto>
{
	constructor(
		private readonly progressRepository: IExerciseProgressRepository,
	) {}

	async execute(
		command: FindExerciseProgressByRepoIdForUserQuery,
	): Promise<ExerciseProgressDto> {
		const userId = UserId.create(UUID.create(command.userId));
		const repositoryId = RepositoryId.create(command.repositoryId);

		const progress = await this.progressRepository.findFirst({
			userId: userId.toString(),
			repositoryId: repositoryId.primitive(),
		});

		if (!progress) {
			throw new ExerciseProgressNotFoundException('', userId.toString());
		}

		return progressAggregateToDto(progress);
	}
}
