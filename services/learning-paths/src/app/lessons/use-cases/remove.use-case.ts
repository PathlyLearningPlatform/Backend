import { InvalidReferenceException } from '@pathly-backend/common/index.js';
import type { RemoveLessonCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { Lesson } from '@/domain/lessons/entities';
import {
	LessonCannotBeRemovedException,
	LessonNotFoundException,
} from '@/domain/lessons/exceptions';

/**
 * @description This class responsibility is to remove a lesson. It uses lessons repository for removing lesson from a data source. lessonsRepository in injected to this class via dependency injection and dependency inversion techniques by using ILessonsRepository interface.
 */
export class RemoveLessonUseCase {
	constructor(private readonly lessonsRepository: ILessonsRepository) {}

	/**
	 *
	 * @param command object with data for removing lesson
	 * @returns removed lesson
	 * @throws LessonNotFoundException if lesson was not found
	 */
	async execute(command: RemoveLessonCommand): Promise<Lesson> {
		try {
			const lesson = await this.lessonsRepository.remove(command);

			if (!lesson) {
				throw new LessonNotFoundException(command.where.id);
			}

			return lesson;
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new LessonCannotBeRemovedException(command.where.id);
			}

			throw err;
		}
	}
}
