import { ActivityId } from '@/domain/activities';
import { Quiz } from '../quiz.aggregate';

export type ListQuizzesOptions = Partial<{
	where: Partial<{
		lessonId: string;
	}>;
	options: Partial<{
		limit: number;
		page: number;
	}>;
}>;

export interface IQuizRepository {
	list(options?: ListQuizzesOptions): Promise<Quiz[]>;

	findById(id: ActivityId): Promise<Quiz | null>;

	save(aggregate: Quiz): Promise<void>;

	remove(id: ActivityId): Promise<boolean>;
}
