import { QuizAttempt } from '../attempt.aggregate';
import { QuizAttemptId } from '../value-objects';

export interface IQuizAttemptRepository {
	findById(id: QuizAttemptId): Promise<QuizAttemptId | null>;

	save(aggregate: QuizAttempt): Promise<void>;

	remove(id: QuizAttemptId): Promise<boolean>;
}
