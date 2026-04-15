import type { IEventBus, IEventHandler } from '@/app/common';
import type { IUnitProgressReadRepository } from '@/app/units/interfaces';
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
		private readonly unitProgressReadRepository: IUnitProgressReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: LessonCompletedEvent): Promise<void> {
		const unitProgressDto =
			await this.unitProgressReadRepository.findOneForUser(
				event.unitId,
				event.userId,
			);

		if (!unitProgressDto) {
			return;
		}

		const unitProgress = await this.unitProgressRepository.load(
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
