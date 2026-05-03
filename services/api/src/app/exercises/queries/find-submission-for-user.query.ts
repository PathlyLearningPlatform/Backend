import { IQueryHandler } from '@/app/common';
import { ExerciseSubmissionDto } from '../dtos';
import {
	IExerciseSubmissionRepository,
	ExerciseSubmissionId,
} from '@/domain/exercises';
import { UUID } from '@/domain/common';
import { ExerciseSubmissionNotFoundException } from '../exceptions';
import { submissionAggregateToDto } from '../helpers';

export type FindOneExerciseSubmissionForUserQuery = {
	exerciseId: string;
	userId: string;
	submissionId: string;
};

export class FindExerciseSubmissionForUserHandler
	implements
		IQueryHandler<FindOneExerciseSubmissionForUserQuery, ExerciseSubmissionDto>
{
	constructor(
		private readonly exerciseSubmissionRepository: IExerciseSubmissionRepository,
	) {}

	async execute(
		command: FindOneExerciseSubmissionForUserQuery,
	): Promise<ExerciseSubmissionDto> {
		const submissionId = ExerciseSubmissionId.create(
			UUID.create(command.submissionId),
		);

		const submission =
			await this.exerciseSubmissionRepository.findFirst(command);

		if (!submission) {
			throw new ExerciseSubmissionNotFoundException(submissionId.value.value);
		}

		return submissionAggregateToDto(submission);
	}
}
