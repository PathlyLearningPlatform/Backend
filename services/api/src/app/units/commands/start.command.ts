import {
	type ICommandHandler,
	type IEventBus,
	UnitNotFoundException,
} from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import {
	type IUnitProgressRepository,
	type IUnitRepository,
	UnitId,
	UnitProgress,
	UnitProgressId,
} from '@/domain/units';
import type { UnitProgressDto } from '../dtos';
import { progressAggregateToDto } from '../helpers';

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
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartUnitCommand): Promise<StartUnitResult> {
		const unitId = UnitId.create(command.unitId);
		const unit = await this.unitRepository.findById(unitId);

		if (!unit) {
			throw new UnitNotFoundException(command.unitId);
		}

		const userId = UserId.create(UUID.create(command.userId));
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
