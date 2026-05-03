import { IQueryHandler } from '@/app/common';
import { ExerciseSubmissionDto } from '../dtos';
import {
	IExerciseSubmissionRepository,
	ExerciseSubmissionId,
} from '@/domain/exercises';
import { UUID } from '@/domain/common';
import { ExerciseSubmissionNotFoundException } from '../exceptions';
import { submissionAggregateToDto } from '../helpers';

export type FindExerciseSubmissionByIdQuery = {
	id: string;
};

export class FindExerciseSubmissionByIdHandler
	implements
		IQueryHandler<FindExerciseSubmissionByIdQuery, ExerciseSubmissionDto>
{
	constructor(
		private readonly exerciseSubmissionRepository: IExerciseSubmissionRepository,
	) {}

	async execute(
		command: FindExerciseSubmissionByIdQuery,
	): Promise<ExerciseSubmissionDto> {
		const submissionId = ExerciseSubmissionId.create(UUID.create(command.id));
		const submission =
			await this.exerciseSubmissionRepository.findById(submissionId);

		if (!submission) {
			throw new ExerciseSubmissionNotFoundException(submissionId.value.value);
		}

		return submissionAggregateToDto(submission);
	}
}
