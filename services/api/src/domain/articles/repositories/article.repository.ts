import { Article } from '../article.aggregate';
import { ArticleId } from '../value-objects';

export type ListArticlesOptions = Partial<{
	options: Partial<{
		limit: number;
		page: number;
	}>;
}>;

export interface IArticleRepository {
	list(options?: ListArticlesOptions): Promise<Article[]>;

	findById(id: ArticleId): Promise<Article | null>;

	save(aggregate: Article): Promise<void>;

	remove(id: ArticleId): Promise<boolean>;
}
