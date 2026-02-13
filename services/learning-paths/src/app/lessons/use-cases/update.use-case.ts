import type { UpdateLessonCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@domain/lessons/interfaces';
import type { Lesson } from '@/domain/lessons/entities';
import {
	LessonNotFoundException,
	LessonOrderException,
} from '@/domain/lessons/exceptions';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';

export class UpdateLessonUseCase {
	constructor(private readonly lessonsRepository: ILessonsRepository) {}

	async execute(command: UpdateLessonCommand): Promise<Lesson> {
		try {
			const lesson = await this.lessonsRepository.findOne(command.where.id);
			if (!lesson) {
				throw new LessonNotFoundException(command.where.id);
			}

			lesson.update({
				description: command.fields?.description,
				name: command.fields?.name,
				order: command.fields?.order,
			});

			await this.lessonsRepository.save(lesson);

			return lesson;
		} catch (err) {
			if (err instanceof UniqueConstraintException) {
				const uniqueOrderViolation =
					err.fields.includes('order') && err.fields.includes('unitId');
				if (uniqueOrderViolation) {
					throw new LessonOrderException();
				}
			}
			throw err;
		}
	}
}
