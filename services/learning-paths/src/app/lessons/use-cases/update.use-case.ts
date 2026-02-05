import type { UpdateLessonCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { Lesson } from '@/domain/lessons/entities';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';

export class UpdateLessonUseCase {
	constructor(private readonly lessonsRepository: ILessonsRepository) {}

	async execute(command: UpdateLessonCommand): Promise<Lesson> {
		const lesson = await this.lessonsRepository.findOne(command.where.id);

		if (!lesson) {
			throw new LessonNotFoundException(command.where.id);
		}

		lesson.update({
			description: command.fields?.description,
			name: command.fields?.name,
			order: command.fields?.order,
		});

		this.lessonsRepository.save(lesson);

		return lesson;
	}
}
