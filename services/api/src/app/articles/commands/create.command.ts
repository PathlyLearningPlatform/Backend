import { randomUUID } from 'node:crypto';
import type { ArticleDto } from '../dtos';
import { type ICommandHandler, LessonNotFoundException } from '@/app/common';
import { Article } from '@/domain/articles/article.aggregate';
import {
	ActivityDescription,
	ActivityName,
	ActivityType,
} from '@/domain/activities/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Url } from '@/domain/common';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { LessonId } from '@/domain/lessons/value-objects/id.vo';
import { IArticleRepository } from '@/domain/articles/repositories';

type CreateArticleCommand = {
	lessonId: string;
	name: string;
	description?: string | null;
	ref: string;
};
type CreateArticleResult = ArticleDto;

export class CreateArticleHandler
	implements ICommandHandler<CreateArticleCommand, CreateArticleResult>
{
	constructor(
		private readonly lessonRepository: ILessonRepository,
		private readonly articleRepository: IArticleRepository,
	) {}

	async execute(command: CreateArticleCommand): Promise<CreateArticleResult> {
		const lessonId = LessonId.create(command.lessonId);
		const lesson = await this.lessonRepository.findById(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(lessonId.value);
		}

		const articleId = ActivityId.create(randomUUID());
		const activityRef = lesson.addActivity(articleId);

		const article = Article.create(activityRef.activityId, {
			createdAt: new Date(),
			lessonId,
			name: ActivityName.create(command.name),
			description:
				command.description != null
					? ActivityDescription.create(command.description)
					: null,
			order: activityRef.order,
			ref: Url.create(command.ref),
		});

		lesson.update(new Date());

		await this.articleRepository.save(article);
		await this.lessonRepository.save(lesson);

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
