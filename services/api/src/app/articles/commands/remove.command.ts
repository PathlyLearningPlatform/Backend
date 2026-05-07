import { ArticleNotFoundException, ICommandHandler } from '@/app/common';
import { ArticleId, IArticleRepository } from '@/domain/articles';
import { UUID } from '@/domain/common';

export type RemoveArticleCommand = {
	id: string;
};

export class RemoveArticleHandler
	implements ICommandHandler<RemoveArticleCommand>
{
	constructor(private readonly articleRepository: IArticleRepository) {}

	async execute(command: RemoveArticleCommand): Promise<void> {
		const id = ArticleId.create(UUID.create(command.id));
		const wasRemoved = await this.articleRepository.remove(id);

		if (!wasRemoved) {
			throw new ArticleNotFoundException(command.id);
		}
	}
}
