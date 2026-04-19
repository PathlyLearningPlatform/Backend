import { ActivityId } from '@/domain/activities';
import { Article } from '../article.aggregate';

export type ListArticlesOptions = Partial<{
	where: Partial<{
		lessonId: string;
	}>;
	options: Partial<{
		limit: number;
		page: number;
	}>;
}>;

export interface IArticleRepository {
	list(options?: ListArticlesOptions): Promise<Article[]>;

	findById(id: ActivityId): Promise<Article | null>;

	save(aggregate: Article): Promise<void>;

	remove(id: ActivityId): Promise<boolean>;
}
