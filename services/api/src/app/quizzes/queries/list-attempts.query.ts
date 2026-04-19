import { IQueryHandler, OffsetPagination } from '@/app/common';
import { QuizAttemptDto } from '../dtos';
import { IQuizAttemptRepository } from '@/domain/quizzes/repositories';
import { attemptToDto } from '../helpers';

export type ListQuizAttemptsQuery = {
	where?: Partial<{
		quizId: string;
		userId: string;
	}>;
	options?: OffsetPagination;
};

export class ListQuizAttemptsHandler
	implements IQueryHandler<ListQuizAttemptsQuery, QuizAttemptDto[]>
{
	constructor(private readonly quizAttemptRepository: IQuizAttemptRepository) {}

	async execute(query: ListQuizAttemptsQuery): Promise<QuizAttemptDto[]> {
		const attempts = await this.quizAttemptRepository.list(query);

		return attempts.map(attemptToDto);
	}
}
