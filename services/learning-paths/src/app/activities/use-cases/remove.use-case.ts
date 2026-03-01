import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import { Lesson } from '@/domain/lessons/entities';
import { ILessonsRepository } from '@/domain/lessons/interfaces';
import type { IActivitiesRepository } from '@domain/activities/interfaces';

export class RemoveActivityUseCase {
	constructor(
		private readonly activitiesRepository: IActivitiesRepository,
		private readonly lessonsRepository: ILessonsRepository,
	) {}

	async execute(id: string): Promise<void> {
		const activity = await this.activitiesRepository.remove(id);

		if (!activity) {
			throw new ActivityNotFoundException(id);
		}

		// lesson will never be null, because activity cannot be created with lessonId that doesnt exist
		const lesson = (await this.lessonsRepository.findOne(
			activity.lessonId,
		)) as Lesson;

		lesson.update({
			activityCount: lesson.activityCount - 1,
		});

		await this.lessonsRepository.save(lesson);
	}
}
