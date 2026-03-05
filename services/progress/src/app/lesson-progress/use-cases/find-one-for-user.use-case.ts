import { LessonProgress } from '@/domain/lesson-progress/entities/lesson-progress.entity';
import { ILessonProgressRepository } from '../interfaces';
import { LessonProgressNotFoundException } from '@/domain/lesson-progress/exceptions';

export class FindOneLessonProgressForUserUseCase {
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
	) {}

	async execute(lessonId: string, userId: string): Promise<LessonProgress> {
		const result = await this.lessonProgressRepository.findOneForUser(
			lessonId,
			userId,
		);

		if (!result) {
			throw new LessonProgressNotFoundException(undefined, lessonId, userId);
		}

		return result;
	}
}
