import type { IEventBus, IEventHandler } from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import type { LessonCompletedEvent } from '@/domain/lessons';
import {
	type IUnitProgressRepository,
	UnitId,
	UnitProgressId,
} from '@/domain/units';

export class OnLessonCompletedHandler
	implements IEventHandler<LessonCompletedEvent>
{
	constructor(
		private readonly unitProgressRepository: IUnitProgressRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: LessonCompletedEvent): Promise<void> {
		const unitProgress = await this.unitProgressRepository.findById(
			UnitProgressId.create(
				UnitId.create(event.unitId),
				UserId.create(UUID.create(event.userId)),
			),
		);

		if (!unitProgress) {
			return;
		}

		unitProgress.completeLesson(event.occuredAt);

		await this.unitProgressRepository.save(unitProgress);

		const events = unitProgress.pullEvents();
		await this.eventBus.publish(events);
	}
}
