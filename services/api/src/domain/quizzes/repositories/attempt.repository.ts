import { UserId } from '@/domain/common';
import { QuizAttempt } from '../attempt.aggregate';
import { QuizAttemptId } from '../value-objects';

export type ListQuizAttemptsOptions = Partial<{
	where: Partial<{
		userId: string;
		quizId: string;
	}>;
	options: Partial<{
		limit: number;
		page: number;
	}>;
}>;

export interface IQuizAttemptRepository {
	list(options?: ListQuizAttemptsOptions): Promise<QuizAttempt[]>;

	findById(id: QuizAttemptId): Promise<QuizAttempt | null>;

	findForUser(id: QuizAttemptId, userId: UserId): Promise<QuizAttempt | null>;

	save(aggregate: QuizAttempt): Promise<void>;

	remove(id: QuizAttemptId): Promise<boolean>;
}
