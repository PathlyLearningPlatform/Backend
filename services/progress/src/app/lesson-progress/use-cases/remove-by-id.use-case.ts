import { ILessonProgressRepository } from '../interfaces';
import { LessonProgressNotFoundException } from '@/domain/lesson-progress/exceptions';

export class RemoveLessonProgressByIdUseCase {
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
	) {}

	async execute(id: string): Promise<void> {
		const result = await this.lessonProgressRepository.removeById(id);

		if (!result) {
			throw new LessonProgressNotFoundException(id);
		}
	}
}
