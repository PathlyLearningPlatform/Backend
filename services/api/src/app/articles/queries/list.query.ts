import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { ArticleDto } from '../dtos';
import { aggregateToDto } from '../helpers';
import { IArticleRepository } from '@/domain/articles/repositories';

type ListArticlesQuery = {
	options?: OffsetPagination;
};

export class ListArticlesHandler
	implements IQueryHandler<ListArticlesQuery, ArticleDto[]>
{
	constructor(private readonly articleRepository: IArticleRepository) {}

	async execute(query: ListArticlesQuery): Promise<ArticleDto[]> {
		const articles = await this.articleRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return articles.map(aggregateToDto);
	}
}
