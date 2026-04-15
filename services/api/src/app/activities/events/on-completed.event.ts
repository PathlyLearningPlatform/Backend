import type { IEventBus, IEventHandler } from '@/app/common';
import type { ILessonProgressReadRepository } from '@/app/lessons/interfaces';
import type { ActivityCompletedEvent } from '@/domain/activities';
import { UserId, UUID } from '@/domain/common';
import {
	type ILessonProgressRepository,
	LessonId,
	LessonProgress,
	LessonProgressId,
} from '@/domain/lessons';

export class OnActivityCompletedHandler
	implements IEventHandler<ActivityCompletedEvent>
{
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
		private readonly lessonProgressReadRepository: ILessonProgressReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: ActivityCompletedEvent): Promise<void> {
		const lessonProgressDto =
			await this.lessonProgressReadRepository.findOneForUser(
				event.lessonId,
				event.userId,
			);

		if (!lessonProgressDto) {
			return;
		}

		const lessonProgress = await this.lessonProgressRepository.load(
			LessonProgressId.create(
				LessonId.create(event.lessonId),
				UserId.create(UUID.create(event.userId)),
			),
		);

		if (!lessonProgress) {
			return;
		}

		lessonProgress.completeActivity(event.occuredAt);

		await this.lessonProgressRepository.save(lessonProgress);

		const events = lessonProgress.pullEvents();
		await this.eventBus.publish(events);
	}
}
