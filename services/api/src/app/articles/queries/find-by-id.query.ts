import { ArticleNotFoundException, type IQueryHandler } from '@/app/common';
import type { ArticleDto } from '../dtos';
import { aggregateToDto } from '../helpers';
import { IArticleRepository } from '@/domain/articles/repositories';
import { ArticleId } from '@/domain/articles';
import { UUID } from '@/domain/common';

type FindArticleByIdQuery = {
	where: {
		id: string;
	};
};
type FindArticleByIdResult = ArticleDto;

export class FindArticleByIdHandler
	implements IQueryHandler<FindArticleByIdQuery, FindArticleByIdResult>
{
	constructor(private readonly articleRepository: IArticleRepository) {}

	async execute(query: FindArticleByIdQuery): Promise<FindArticleByIdResult> {
		const articleId = ArticleId.create(UUID.create(query.where.id));
		const article = await this.articleRepository.findById(articleId);

		if (!article) {
			throw new ArticleNotFoundException(query.where.id);
		}

		return aggregateToDto(article);
	}
}
