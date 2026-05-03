import { ICommandHandler } from '@/app/common';
import { ExerciseProgressDto } from '../dtos';
import {
	ExerciseId,
	ExerciseProgress,
	ExerciseProgressId,
	IExerciseProgressRepository,
	IExerciseRepository,
} from '@/domain/exercises';
import { RepositoryId, Url, UserId, UUID } from '@/domain/common';
import { ExerciseNotFoundException } from '../exceptions';
import { progressAggregateToDto } from '../helpers';

export type StartExerciseCommand = {
	userId: string;
	exerciseId: string;
	repositoryId: number;
	respositoryUrl: string;
};

export class StartExerciseHandler
	implements ICommandHandler<StartExerciseCommand, ExerciseProgressDto>
{
	constructor(
		private readonly exerciseRepository: IExerciseRepository,
		private readonly exerciseProgressRepository: IExerciseProgressRepository,
	) {}

	async execute(command: StartExerciseCommand): Promise<ExerciseProgressDto> {
		const userId = UserId.create(UUID.create(command.userId));

		const exerciseId = ExerciseId.create(UUID.create(command.exerciseId));
		const exercise = await this.exerciseRepository.findById(exerciseId);

		if (!exercise) {
			throw new ExerciseNotFoundException(command.exerciseId);
		}

		const progressId = ExerciseProgressId.create(exerciseId, userId);
		const progress = ExerciseProgress.create(progressId, {
			repositoryId: RepositoryId.create(command.repositoryId),
			repositoryUrl: Url.create(command.respositoryUrl),
		});

		await this.exerciseProgressRepository.save(progress);

		return progressAggregateToDto(progress);
	}
}
