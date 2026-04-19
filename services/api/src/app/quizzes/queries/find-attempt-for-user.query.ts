import { IQueryHandler, QuizAttemptNotFoundException } from '@/app/common';
import { QuizAttemptDto } from '../dtos';
import { IQuizAttemptRepository } from '@/domain/quizzes/repositories';
import { attemptToDto } from '../helpers';
import { QuizAttemptId } from '@/domain/quizzes';
import { UserId, UUID } from '@/domain/common';

export type FindQuizAttemptForUserQuery = {
	userId: string;
	attemptId: string;
};

export class FindQuizAttemptForUserHandler
	implements IQueryHandler<FindQuizAttemptForUserQuery, QuizAttemptDto>
{
	constructor(private readonly quizAttemptRepository: IQuizAttemptRepository) {}

	async execute(query: FindQuizAttemptForUserQuery): Promise<QuizAttemptDto> {
		const attempt = await this.quizAttemptRepository.findForUser(
			QuizAttemptId.create(UUID.create(query.attemptId)),
			UserId.create(UUID.create(query.userId)),
		);

		if (!attempt) {
			throw new QuizAttemptNotFoundException(query.attemptId);
		}

		return attemptToDto(attempt);
	}
}
