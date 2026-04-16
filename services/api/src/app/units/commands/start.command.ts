import {
	type ICommandHandler,
	type IEventBus,
	UnitNotFoundException,
} from '@/app/common';
import { Order, UserId, UUID } from '@/domain/common';
import {
	type IUnitProgressRepository,
	type IUnitRepository,
	PreviousUnitNotCompletedException,
	UnitId,
	UnitProgress,
	UnitProgressId,
} from '@/domain/units';
import type { UnitProgressDto } from '../dtos';
import { progressAggregateToDto } from '../helpers';
import {
	type ISectionProgressRepository,
	SectionProgressId,
} from '@/domain/sections';
import { SectionProgressNotFoundException } from '@/app/sections/exceptions';

export type StartUnitCommand = {
	unitId: string;
	userId: string;
};
export type StartUnitResult = UnitProgressDto;

export class StartUnitHandler
	implements ICommandHandler<StartUnitCommand, StartUnitResult>
{
	constructor(
		private readonly unitProgressRepository: IUnitProgressRepository,
		private readonly unitRepository: IUnitRepository,
		private readonly sectionProgressRepository: ISectionProgressRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartUnitCommand): Promise<StartUnitResult> {
		const unitId = UnitId.create(command.unitId);
		const unit = await this.unitRepository.findById(unitId);

		if (!unit) {
			throw new UnitNotFoundException(command.unitId);
		}

		const userId = UserId.create(UUID.create(command.userId));
		const sectionProgressId = SectionProgressId.create(unit.sectionId, userId);

		const sectionProgress =
			await this.sectionProgressRepository.findById(sectionProgressId);

		if (!sectionProgress) {
			throw new SectionProgressNotFoundException('');
		}

		if (!unit.order.equals(Order.create(0))) {
			const previousUnit = await this.unitRepository.findBySectionIdAndOrder(
				unit.sectionId,
				Order.create(unit.order.value - 1),
			);

			if (!previousUnit) {
				throw new PreviousUnitNotCompletedException();
			}

			const previousUnitProgress = await this.unitProgressRepository.findById(
				UnitProgressId.create(previousUnit.id, userId),
			);

			if (!previousUnitProgress?.completedAt) {
				throw new PreviousUnitNotCompletedException();
			}
		}

		const id = UnitProgressId.create(unitId, userId);
		const unitProgress = UnitProgress.create(id, {
			sectionId: unit.sectionId,
			totalLessonCount: unit.lessonCount,
		});

		await this.unitProgressRepository.save(unitProgress);

		const events = unitProgress.pullEvents();
		await this.eventBus.publish(events);

		return progressAggregateToDto(unitProgress);
	}
}
