import type { FindLessonsCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { Lesson } from '@/domain/lessons/entities';

export class FindLessonsUseCase {
	constructor(private readonly lessonsRepository: ILessonsRepository) {}

	async execute(command: FindLessonsCommand): Promise<Lesson[]> {
		return this.lessonsRepository.find(command);
	}
}
