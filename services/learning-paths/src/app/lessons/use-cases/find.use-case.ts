import type { FindLessonsCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { Lesson } from '@/domain/lessons/entities';

/**
 * @description This class responsibility is to find lessons. It uses lessons repository for retrieving lessons from a data source. lessonsRepository in injected to this class via dependency injection and dependency inversion techniques by using ILessonsRepository interface.
 */
export class FindLessonsUseCase {
	constructor(private readonly lessonsRepository: ILessonsRepository) {}

	/**
	 * @param command object with data for finding lessons
	 * @returns found lessons
	 * @description this function retrievies lessons from a data source using given command
	 */
	async execute(command: FindLessonsCommand): Promise<Lesson[]> {
		return this.lessonsRepository.find(command);
	}
}
