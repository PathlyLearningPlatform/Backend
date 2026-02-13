import { randomUUID } from 'crypto';
import { Article } from '@/domain/activities/entities';
import { ActivityType } from '@/domain/activities/enums';
import type { CreateArticleCommand } from '../commands/create-article.command';
import type { IActivitiesRepository } from '@domain/activities/interfaces';
import { ILessonsRepository } from '@/domain/lessons/interfaces';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';
import { UnitOrderException } from '@/domain/units/exceptions';
import { ActivityOrderException } from '@/domain/activities/exceptions';

export class CreateArticleUseCase {
	constructor(
		private readonly activitiesRepository: IActivitiesRepository,
		private readonly lessonsRepository: ILessonsRepository,
	) {}

	async execute(command: CreateArticleCommand): Promise<Article> {
		try {
			const lesson = await this.lessonsRepository.findOne(command.lessonId);

			if (!lesson) {
				throw new LessonNotFoundException(command.lessonId);
			}

			const article = new Article({
				id: randomUUID(),
				lessonId: command.lessonId,
				createdAt: new Date(),
				updatedAt: new Date(),
				name: command.name,
				order: command.order,
				type: ActivityType.ARTICLE,
				description: command.description || null,
				ref: command.ref,
			});

			await this.activitiesRepository.saveArticle(article);

			return article;
		} catch (err) {
			if (err instanceof UniqueConstraintException) {
				const uniqueOrderViolation =
					err.fields.includes('order') && err.fields.includes('lessonId');

				if (uniqueOrderViolation) {
					throw new ActivityOrderException();
				}
			}

			throw err;
		}
	}
}
