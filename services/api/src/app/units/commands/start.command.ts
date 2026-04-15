import {
	type ICommandHandler,
	type IEventBus,
	UnitNotFoundException,
} from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import { SectionId } from '@/domain/sections';
import {
	type IUnitProgressRepository,
	UnitId,
	UnitProgress,
	UnitProgressId,
} from '@/domain/units';
import type { UnitProgressDto } from '../dtos';
import type { IUnitReadRepository } from '../interfaces';

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
		private readonly unitReadRepository: IUnitReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartUnitCommand): Promise<StartUnitResult> {
		const unit = await this.unitReadRepository.findById(command.unitId);

		if (!unit) {
			throw new UnitNotFoundException(command.unitId);
		}

		const unitId = UnitId.create(command.unitId);
		const userId = UserId.create(UUID.create(command.userId));
		const id = UnitProgressId.create(unitId, userId);
		const unitProgress = UnitProgress.create(id, {
			sectionId: SectionId.create(unit.sectionId),
			totalLessonCount: unit.lessonCount,
		});

		await this.unitProgressRepository.save(unitProgress);

		const events = unitProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			completedAt: unitProgress.completedAt,
			unitId: unitProgress.unitId.value,
			sectionId: unitProgress.sectionId.value,
			userId: unitProgress.userId.toString(),
			totalLessonCount: unitProgress.totalLessonCount,
			completedLessonCount: unitProgress.completedLessonCount,
		};
	}
}
