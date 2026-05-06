import type { IEventBus, IEventHandler } from '@/app/common';
import { Order, UserId, UUID } from '@/domain/common';
import {
	type ISectionProgressRepository,
	SectionId,
	SectionProgressId,
} from '@/domain/sections';
import {
	IUnitProgressRepository,
	IUnitRepository,
	UnitId,
	UnitProgress,
	UnitProgressId,
	type UnitCompletedEvent,
} from '@/domain/units';

export class OnUnitCompletedHandler
	implements IEventHandler<UnitCompletedEvent>
{
	constructor(
		private readonly sectionProgressRepository: ISectionProgressRepository,
		private readonly unitProgressRepository: IUnitProgressRepository,
		private readonly unitRepository: IUnitRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: UnitCompletedEvent): Promise<void> {
		const sectionId = SectionId.create(event.payload.sectionId);
		const userId = UserId.create(UUID.create(event.userId));

		const sectionProgress = await this.sectionProgressRepository.findById(
			SectionProgressId.create(sectionId, userId),
		);

		if (!sectionProgress) {
			return;
		}

		sectionProgress.completeUnit(event.occuredAt);

		await this.sectionProgressRepository.save(sectionProgress);
		await this.eventBus.publish(sectionProgress.pullEvents());

		const unitId = UnitId.create(event.payload.unitId);
		const unit = await this.unitRepository.findById(unitId);

		if (!unit) {
			return;
		}

		const nextUnit = await this.unitRepository.findBySectionIdAndOrder(
			sectionId,
			Order.create(unit.order.value + 1),
		);

		if (!nextUnit) {
			console.log(
				`Unit ${unit.id.value} is the last in section ${sectionId.value}`,
			);
			return;
		}

		const nextUnitProgressId = UnitProgressId.create(nextUnit.id, userId);
		const nextUnitProgress = UnitProgress.create(nextUnitProgressId, {
			createdAt: event.occuredAt,
			totalLessonCount: nextUnit.lessonCount,
			sectionId: sectionId,
		});

		await this.unitProgressRepository.save(nextUnitProgress);
		await this.eventBus.publish(nextUnitProgress.pullEvents());
	}
}
