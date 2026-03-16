import { ICommandHandler, UnitNotFoundException } from '@/app/common';
import { UnitProgressDto } from '../dtos';
import {
	IUnitProgressRepository,
	UnitId,
	UnitProgress,
	UnitProgressId,
} from '@/domain/unit-progress';
import { IEventBus, ILearningPathsService } from '@/app/common/ports';
import { UserId, UUID } from '@/domain/common';
import { SectionId } from '@/domain/section-progress';
import { ISectionProgressReadRepository } from '@/app/section-progress/interfaces';
import { SectionNotStartedException } from '../exceptions';
import { randomUUID } from 'node:crypto';

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
		private readonly sectionProgressReadRepository: ISectionProgressReadRepository,
		private readonly learningPathsService: ILearningPathsService,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartUnitCommand): Promise<UnitProgressDto> {
		// TODO: check if user exists

		const unit = await this.learningPathsService.findUnitById(command.unitId);

		if (!unit) {
			throw new UnitNotFoundException(command.unitId);
		}

		const sectionProgressDto =
			await this.sectionProgressReadRepository.findForUser(
				unit.sectionId,
				command.userId,
			);

		if (!sectionProgressDto) {
			throw new SectionNotStartedException(unit.sectionId, command.userId);
		}

		// TODO: check if previous unit has been completed

		const id = UnitProgressId.create(UUID.create(randomUUID()));
		const unitProgress = UnitProgress.create(id, {
			unitId: UnitId.create(UUID.create(command.unitId)),
			userId: UserId.create(UUID.create(command.userId)),
			totalLessonCount: unit.lessonCount,
			sectionId: SectionId.create(UUID.create(unit.sectionId)),
		});

		await this.unitProgressRepository.save(unitProgress);

		const events = unitProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			id: unitProgress.id.toString(),
			completedAt: unitProgress.completedAt,
			unitId: unitProgress.unitId.toString(),
			sectionId: unitProgress.sectionId.toString(),
			userId: unitProgress.userId.toString(),
			totalLessonCount: unitProgress.totalLessonCount,
			completedLessonCount: unitProgress.completedLessonCount,
		};
	}
}
