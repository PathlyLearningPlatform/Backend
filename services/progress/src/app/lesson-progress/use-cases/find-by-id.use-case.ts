import { LessonProgress } from '@/domain/lesson-progress/entities/lesson-progress.entity';
import { ILessonProgressRepository } from '../interfaces';
import { LessonProgressNotFoundException } from '@/domain/lesson-progress/exceptions';

export class FindLessonProgressByIdUseCase {
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
	) {}

	async execute(id: string): Promise<LessonProgress> {
		const result = await this.lessonProgressRepository.findById(id);

		if (!result) {
			throw new LessonProgressNotFoundException(id);
		}

		return result;
	}
}
