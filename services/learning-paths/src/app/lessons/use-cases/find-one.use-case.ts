import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { Lesson } from '@/domain/lessons/entities';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';

export class FindOneLessonUseCase {
	constructor(private readonly lessonsRepository: ILessonsRepository) {}

	async execute(id: string): Promise<Lesson> {
		const lesson = await this.lessonsRepository.findOne(id);

		if (!lesson) {
			throw new LessonNotFoundException(id);
		}

		return lesson;
	}
}
