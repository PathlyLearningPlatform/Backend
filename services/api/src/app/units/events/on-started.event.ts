import type { IEventBus, IEventHandler } from '@/app/common';
import { Order, UserId, UUID } from '@/domain/common';
import { UnitId, type UnitStartedEvent } from '@/domain/units';
import {
	ILessonProgressRepository,
	ILessonRepository,
	LessonProgress,
	LessonProgressId,
} from '@/domain/lessons';

export class OnUnitStartedHandler implements IEventHandler<UnitStartedEvent> {
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
		private readonly lessonRepository: ILessonRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: UnitStartedEvent): Promise<void> {
		const unitId = UnitId.create(event.payload.unitId);

		const firstLesson = await this.lessonRepository.findByUnitIdAndOrder(
			unitId,
			Order.create(0),
		);

		if (!firstLesson) {
			console.warn(
				`Unit ${event.payload.unitId} does not have any lessons, ignoring started event`,
			);
			return;
		}

		const userId = UserId.create(UUID.create(event.userId));
		const lessonProgressId = LessonProgressId.create(firstLesson.id, userId);

		const lessonProgress = LessonProgress.create(lessonProgressId, {
			createdAt: event.occuredAt,
			unitId: unitId,
			totalActivityCount: firstLesson.activityCount,
		});

		const events = lessonProgress.pullEvents();
		await this.lessonProgressRepository.save(lessonProgress);
		await this.eventBus.publish(events);
	}
}
