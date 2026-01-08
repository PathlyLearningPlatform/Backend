import type { UpdateLessonCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { Lesson } from '@/domain/lessons/entities';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';

/**
 * @description This class responsibility is to update a lesson. It uses lessons repository for updating lessons in a data source. lessonsRepository in injected to this class via dependency injection and dependency inversion techniques by using ILessonsRepository interface.
 */
export class UpdateLessonUseCase {
	constructor(private readonly lessonsRepository: ILessonsRepository) {}

	/**
	 *
	 * @param command object with data for updating lesson
	 * @returns updated lesson
	 * @throws
	 * {LessonNotFoundException} if lesson was not found
	 */
	async execute(command: UpdateLessonCommand): Promise<Lesson> {
		const updatedLesson = await this.lessonsRepository.update(command);

		if (!updatedLesson) {
			throw new LessonNotFoundException(command.where.id);
		}

		return updatedLesson;
	}
}
