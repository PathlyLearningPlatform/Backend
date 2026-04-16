import {
	type ICommandHandler,
	type IEventBus,
	SectionNotFoundException,
} from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import {
	type ISectionProgressRepository,
	type ISectionRepository,
	SectionId,
	SectionProgress,
	SectionProgressId,
} from '@/domain/sections';
import type { SectionProgressDto } from '../dtos';
import { progressAggregateToDto } from '../helpers';

export type StartSectionCommand = {
	sectionId: string;
	userId: string;
};
export type StartSectionResult = SectionProgressDto;

export class StartSectionHandler
	implements ICommandHandler<StartSectionCommand, StartSectionResult>
{
	constructor(
		private readonly sectionProgressRepository: ISectionProgressRepository,
		private readonly sectionRepository: ISectionRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartSectionCommand): Promise<StartSectionResult> {
		const sectionId = SectionId.create(command.sectionId);
		const section = await this.sectionRepository.findById(sectionId);

		if (!section) {
			throw new SectionNotFoundException(command.sectionId);
		}

		const userId = UserId.create(UUID.create(command.userId));
		const id = SectionProgressId.create(sectionId, userId);
		const sectionProgress = SectionProgress.create(id, {
			learningPathId: section.learningPathId,
			totalUnitCount: section.unitCount,
		});

		await this.sectionProgressRepository.save(sectionProgress);

		const events = sectionProgress.pullEvents();
		await this.eventBus.publish(events);

		return progressAggregateToDto(sectionProgress);
	}
}
