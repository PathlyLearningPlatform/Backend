import {
	ActivityNotFoundException,
	ArticleNotFoundException,
	type ICommandHandler,
} from '@/app/common';
import {
	ActivityDescription,
	ActivityName,
	ActivityType,
} from '@/domain/activities/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Url } from '@/domain/common';
import type { ArticleDto } from '../dtos';
import { IArticleRepository } from '@/domain/articles/repositories';

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
		const id = ActivityId.create(command.where.id);
		const article = await this.articleRepository.findById(id);

		if (!article) {
			throw new ArticleNotFoundException(id.value);
		}

		const name = command.props?.name
			? ActivityName.create(command.props.name)
			: undefined;

		const description = command.props?.description
			? ActivityDescription.create(command.props.description)
			: command.props?.description === null
				? null
				: undefined;

		const ref = command.props?.ref ? Url.create(command.props.ref) : undefined;

		article.update(new Date(), { name, description, ref });

		await this.articleRepository.save(article);

		return {
			type: ActivityType.ARTICLE,
			id: article.id.value,
			lessonId: article.lessonId.value,
			name: article.name.value,
			description: article.description?.value ?? null,
			createdAt: article.createdAt,
			updatedAt: article.updatedAt ?? null,
			order: article.order.value,
			ref: article.ref.value,
		};
	}
}
