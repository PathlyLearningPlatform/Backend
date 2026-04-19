import { IQueryHandler, QuizAttemptNotFoundException } from '@/app/common';
import { QuizAttemptDto } from '../dtos';
import { IQuizAttemptRepository } from '@/domain/quizzes/repositories';
import { attemptToDto } from '../helpers';
import { QuizAttemptId } from '@/domain/quizzes';
import { UUID } from '@/domain/common';

export type FindQuizAttemptByIdQuery = {
	id: string;
};

export class FindQuizAttemptByIdHandler
	implements IQueryHandler<FindQuizAttemptByIdQuery, QuizAttemptDto>
{
	constructor(private readonly quizAttemptRepository: IQuizAttemptRepository) {}

	async execute(query: FindQuizAttemptByIdQuery): Promise<QuizAttemptDto> {
		const attempt = await this.quizAttemptRepository.findById(
			QuizAttemptId.create(UUID.create(query.id)),
		);

		if (!attempt) {
			throw new QuizAttemptNotFoundException(query.id);
		}

		return attemptToDto(attempt);
	}
}
