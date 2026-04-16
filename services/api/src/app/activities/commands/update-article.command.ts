import { ActivityNotFoundException, type ICommandHandler } from '@/app/common';
import { Article } from '@/domain/articles/article.aggregate';
import type { IActivityRepository } from '@/domain/activities/repositories';
import {
	ActivityDescription,
	ActivityName,
	ActivityType,
} from '@/domain/activities/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Url } from '@/domain/common';
import type { ArticleDto } from '../dtos';

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
		const activity = await this.activityRepository.findById(id);

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
			type: ActivityType.ARTICLE,
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
