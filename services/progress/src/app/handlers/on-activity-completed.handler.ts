import { ActivityCompletedEvent } from '@/domain/activity-progress/events';
import { IEventBus } from '../common';
import { ILessonProgressRepository } from '../lesson-progress/interfaces';

export class OnActivityCompletedHandler {
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: ActivityCompletedEvent) {
		console.log('event: ', event);

		let lessonProgress = await this.lessonProgressRepository.findOneForUser(
			event.lessonId,
			event.userId,
		);

		if (!lessonProgress) {
			return;
		}

		lessonProgress.completeActivity(new Date());

		const events = await this.lessonProgressRepository.save(lessonProgress);

		await this.eventBus.publish(events);
	}
}
