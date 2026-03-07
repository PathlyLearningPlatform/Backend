import { ICommandHandler, ActivityNotFoundException } from '@/app/common';
import { IActivityRepository } from '@/domain/activities/interfaces';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import {
	ActivityDescription,
	ActivityName,
} from '@/domain/activities/value-objects';
import { Article } from '@/domain/activities/articles/article.aggregate';
import { Url } from '@/domain/common';
import { ArticleDto } from '../dtos';

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
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(command: UpdateArticleCommand): Promise<UpdateArticleResult> {
		const id = ActivityId.create(command.where.id);
		const activity = await this.activityRepository.load(id);

		if (!activity || !(activity instanceof Article)) {
			throw new ActivityNotFoundException(id.value);
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

		activity.update(new Date(), { name, description, ref });

		await this.activityRepository.save(activity);

		return {
			id: activity.id.value,
			lessonId: activity.lessonId.value,
			name: activity.name.value,
			description: activity.description?.value ?? null,
			createdAt: activity.createdAt,
			updatedAt: activity.updatedAt ?? null,
			order: activity.order.value,
			ref: activity.ref.value,
		};
	}
}
