import { ActivityId } from '@/domain/activities';
import { Quiz } from '../quiz.aggregate';

export interface IQuizRepository {
	findById(id: ActivityId): Promise<Quiz | null>;

	save(aggregate: Quiz): Promise<void>;

	remove(id: ActivityId): Promise<boolean>;
}
