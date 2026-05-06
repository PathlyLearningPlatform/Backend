import type { IEventBus, IEventHandler } from '@/app/common';
import { Order, UserId, UUID } from '@/domain/common';
import { SectionId, type SectionStartedEvent } from '@/domain/sections';
import {
	IUnitProgressRepository,
	IUnitRepository,
	UnitProgress,
	UnitProgressId,
} from '@/domain/units';

export class OnSectionStartedHandler
	implements IEventHandler<SectionStartedEvent>
{
	constructor(
		private readonly unitProgressRepository: IUnitProgressRepository,
		private readonly unitRepository: IUnitRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: SectionStartedEvent): Promise<void> {
		const sectionId = SectionId.create(event.payload.sectionId);

		const firstUnit = await this.unitRepository.findBySectionIdAndOrder(
			sectionId,
			Order.create(0),
		);

		if (!firstUnit) {
			console.warn(
				`Section ${event.payload.sectionId} does not have any units, ignoring started event`,
			);
			return;
		}

		const userId = UserId.create(UUID.create(event.userId));
		const unitProgressId = UnitProgressId.create(firstUnit.id, userId);

		const unitProgress = UnitProgress.create(unitProgressId, {
			createdAt: event.occuredAt,
			sectionId: sectionId,
			totalLessonCount: firstUnit.lessonCount,
		});

		const events = unitProgress.pullEvents();
		await this.unitProgressRepository.save(unitProgress);
		await this.eventBus.publish(events);
	}
}
