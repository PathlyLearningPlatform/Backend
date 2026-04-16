import type { IEventBus, IEventHandler } from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import {
	type ISectionProgressRepository,
	SectionId,
	SectionProgressId,
} from '@/domain/sections';
import type { UnitCompletedEvent } from '@/domain/units';

export class OnUnitCompletedHandler
	implements IEventHandler<UnitCompletedEvent>
{
	constructor(
		private readonly sectionProgressRepository: ISectionProgressRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: UnitCompletedEvent): Promise<void> {
		const sectionProgress = await this.sectionProgressRepository.findById(
			SectionProgressId.create(
				SectionId.create(event.sectionId),
				UserId.create(UUID.create(event.userId)),
			),
		);

		if (!sectionProgress) {
			return;
		}

		sectionProgress.completeUnit(event.occuredAt);

		await this.sectionProgressRepository.save(sectionProgress);

		const events = sectionProgress.pullEvents();
		await this.eventBus.publish(events);
	}
}
