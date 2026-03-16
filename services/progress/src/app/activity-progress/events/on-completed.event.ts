import { IEventHandler } from '@/app/common';
import { IEventBus } from '@/app/common/ports';
import { ILessonProgressReadRepository } from '@/app/lesson-progress/interfaces';
import { ActivityCompletedEvent } from '@/domain/activity-progress';
import { UUID } from '@/domain/common';
import {
	ILessonProgressRepository,
	LessonProgressId,
} from '@/domain/lesson-progress';

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
			await this.lessonProgressReadRepository.findForUser(
				event.lessonId,
				event.userId,
			);

		if (!lessonProgressDto) {
			return;
		}

		const lessonProgress = await this.lessonProgressRepository.load(
			LessonProgressId.create(UUID.create(lessonProgressDto.id)),
		);

		if (!lessonProgress) {
			return;
		}

		lessonProgress.completeActivity(event.occuredAt);

		const events = lessonProgress.pullEvents();
		await this.eventBus.publish(events);
	}
}
