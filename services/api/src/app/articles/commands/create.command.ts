import { randomUUID } from 'node:crypto';
import type { ArticleDto } from '../dtos';
import { type ICommandHandler } from '@/app/common';
import { Article } from '@/domain/articles/article.aggregate';
import { Url, UUID } from '@/domain/common';
import { IArticleRepository } from '@/domain/articles/repositories';
import { ArticleId } from '@/domain/articles';
import { aggregateToDto } from '../helpers';

type CreateArticleCommand = {
	name: string;
	description?: string;
	ref: string;
};
type CreateArticleResult = ArticleDto;

export class CreateArticleHandler
	implements ICommandHandler<CreateArticleCommand, CreateArticleResult>
{
	constructor(private readonly articleRepository: IArticleRepository) {}

	async execute(command: CreateArticleCommand): Promise<CreateArticleResult> {
		const articleId = ArticleId.create(UUID.create(randomUUID()));

		const article = Article.create(articleId, {
			createdAt: new Date(),
			name: command.name,
			description: command.description,
			ref: Url.create(command.ref),
		});

		await this.articleRepository.save(article);

		return aggregateToDto(article);
	}
}
