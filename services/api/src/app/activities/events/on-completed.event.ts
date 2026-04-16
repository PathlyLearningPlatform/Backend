import type { IEventBus, IEventHandler } from '@/app/common';
import type { ActivityCompletedEvent } from '@/domain/activities';
import { UserId, UUID } from '@/domain/common';
import {
	type ILessonProgressRepository,
	LessonId,
	LessonProgressId,
} from '@/domain/lessons';

export class OnActivityCompletedHandler
	implements IEventHandler<ActivityCompletedEvent>
{
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: ActivityCompletedEvent): Promise<void> {
		const lessonProgress = await this.lessonProgressRepository.findById(
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
