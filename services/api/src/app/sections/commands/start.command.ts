import {
	type ICommandHandler,
	type IEventBus,
	SectionNotFoundException,
} from "@/app/common";
import { UserId, UUID } from "@/domain/common";
import { LearningPathId } from "@/domain/learning-paths";
import {
	type ISectionProgressRepository,
	SectionId,
	SectionProgress,
	SectionProgressId,
} from "@/domain/sections";
import type { SectionProgressDto } from "../dtos";
import type { ISectionReadRepository } from "../interfaces";

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
		private readonly sectionReadRepository: ISectionReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartSectionCommand): Promise<StartSectionResult> {
		const section = await this.sectionReadRepository.findById(
			command.sectionId,
		);

		if (!section) {
			throw new SectionNotFoundException(command.sectionId);
		}

		const sectionId = SectionId.create(command.sectionId);
		const userId = UserId.create(UUID.create(command.userId));
		const id = SectionProgressId.create(sectionId, userId);
		const sectionProgress = SectionProgress.create(id, {
			learningPathId: LearningPathId.create(
				UUID.create(section.learningPathId),
			),
			totalUnitCount: section.unitCount,
		});

		await this.sectionProgressRepository.save(sectionProgress);

		const events = sectionProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			id: sectionProgress.id.toString(),
			completedUnitCount: sectionProgress.completedUnitCount,
			totalUnitCount: sectionProgress.totalUnitCount,
			learningPathId: sectionProgress.learningPathId.toString(),
			sectionId: sectionProgress.sectionId.value,
			userId: sectionProgress.userId.toString(),
			completedAt: sectionProgress.completedAt,
		};
	}
}
