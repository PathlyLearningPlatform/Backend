import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { ArticleDto } from '../dtos';
import { aggregateToDto } from '../helpers';
import { IArticleRepository } from '@/domain/articles/repositories';

type ListArticlesQuery = {
	where?: {
		lessonId?: string;
	};
	options?: OffsetPagination;
};
type ListArticlesResult = ArticleDto[];

export class ListArticlesHandler
	implements IQueryHandler<ListArticlesQuery, ListArticlesResult>
{
	constructor(private readonly articleRepository: IArticleRepository) {}

	async execute(query: ListArticlesQuery): Promise<ListArticlesResult> {
		const articles = await this.articleRepository.list({
			where: {
				lessonId: query.where?.lessonId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return articles.map(aggregateToDto);
	}
}
