import { ArticleNotFoundException, type ICommandHandler } from '@/app/common';
import { Url, UUID } from '@/domain/common';
import type { ArticleDto } from '../dtos';
import { IArticleRepository } from '@/domain/articles/repositories';
import { ArticleId } from '@/domain/articles';
import { aggregateToDto } from '../helpers';

type UpdateArticleCommand = {
	where: {
		id: string;
	};
	props?: {
		name?: string;
		description?: string | null;
		ref?: string;
	};
};
type UpdateArticleResult = ArticleDto;

export class UpdateArticleHandler
	implements ICommandHandler<UpdateArticleCommand, UpdateArticleResult>
{
	constructor(private readonly articleRepository: IArticleRepository) {}

	async execute(command: UpdateArticleCommand): Promise<UpdateArticleResult> {
		const id = ArticleId.create(UUID.create(command.where.id));
		const article = await this.articleRepository.findById(id);

		if (!article) {
			throw new ArticleNotFoundException(id.primitive());
		}

		const ref = command.props?.ref ? Url.create(command.props.ref) : undefined;

		article.update(new Date(), {
			name: article.name,
			description: article.description,
			ref,
		});

		await this.articleRepository.save(article);

		return aggregateToDto(article);
	}
}
