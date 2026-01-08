import type { FindOneLessonCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { Lesson } from '@/domain/lessons/entities';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';

/**
 * @description This class responsibility is to find one lesson. It uses lessons repository for retrieving lesson from a data source. lessonsRepository in injected to this class via dependency injection and dependency inversion techniques by using ILessonsRepository interface.
 */
export class FindOneLessonUseCase {
	constructor(private readonly lessonsRepository: ILessonsRepository) {}

	/**
	 *
	 * @param command object with data for finding one lesson
	 * @returns found lesson
	 * @throws LessonNotFoundException if lesson was not found
	 */
	async execute(command: FindOneLessonCommand): Promise<Lesson> {
		const lesson = await this.lessonsRepository.findOne(command);

		if (!lesson) {
			throw new LessonNotFoundException(command.where.id);
		}

		return lesson;
	}
}
