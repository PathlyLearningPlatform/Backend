import { ILessonProgressRepository } from '../interfaces';
import { StartLessonCommand } from '../commands';
import { LessonAlreadyCompletedException } from '@/domain/lesson-progress/exceptions';
import { ILearningPathsService, LessonNotFoundException } from '@/app/common';
import { LessonProgress } from '@/domain/lesson-progress/entities';
import { randomUUID } from 'crypto';

export class StartLessonUseCase {
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
		private readonly learningPathsService: ILearningPathsService,
	) {}

	async execute(command: StartLessonCommand): Promise<LessonProgress> {
		// TODO: check if user exists
		const lesson = await this.learningPathsService.findLessonById(
			command.lessonId,
		);

		if (!lesson) {
			throw new LessonNotFoundException(command.lessonId);
		}

		let lessonProgress = await this.lessonProgressRepository.findOneForUser(
			command.lessonId,
			command.userId,
		);

		if (!lessonProgress) {
			lessonProgress = new LessonProgress({
				id: randomUUID(),
				lessonId: command.lessonId,
				userId: command.userId,
				totalActivityCount: lesson.activityCount,
			});
		}

		if (lessonProgress.completedAt !== null) {
			throw new LessonAlreadyCompletedException();
		}

		await this.lessonProgressRepository.save(lessonProgress);

		return lessonProgress;
	}
}
