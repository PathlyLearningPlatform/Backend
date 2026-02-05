import { InvalidReferenceException } from '@pathly-backend/common/index.js';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import {
	LessonCannotBeRemovedException,
	LessonNotFoundException,
} from '@/domain/lessons/exceptions';

export class RemoveLessonUseCase {
	constructor(private readonly lessonsRepository: ILessonsRepository) {}

	async execute(id: string): Promise<void> {
		try {
			const wasRemoved = await this.lessonsRepository.remove(id);

			if (!wasRemoved) {
				throw new LessonNotFoundException(id);
			}
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new LessonCannotBeRemovedException(id);
			}

			throw err;
		}
	}
}
