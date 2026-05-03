import { IQueryHandler } from '@/app/common';
import { ExerciseSubmissionDto } from '../dtos';
import { IExerciseSubmissionRepository } from '@/domain/exercises';
import { ExerciseSubmissionNotFoundException } from '../exceptions';
import { submissionAggregateToDto } from '../helpers';

export type FindExerciseSubmissionByCommitShaQuery = {
	commitSha: string;
};

export class FindExerciseSubmissionByCommitShaHandler
	implements
		IQueryHandler<FindExerciseSubmissionByCommitShaQuery, ExerciseSubmissionDto>
{
	constructor(
		private readonly exerciseSubmissionRepository: IExerciseSubmissionRepository,
	) {}

	async execute(
		command: FindExerciseSubmissionByCommitShaQuery,
	): Promise<ExerciseSubmissionDto> {
		const submission = await this.exerciseSubmissionRepository.findFirst({
			commitSha: command.commitSha,
		});

		if (!submission) {
			throw new ExerciseSubmissionNotFoundException('');
		}

		return submissionAggregateToDto(submission);
	}
}
