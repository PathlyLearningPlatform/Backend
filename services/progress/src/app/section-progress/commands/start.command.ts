import {
	ICommandHandler,
	IEventBus,
	ILearningPathsService,
	SectionNotFoundException,
} from '@/app/common';
import { SectionProgressDto } from '../dtos';
import {
	ISectionProgressRepository,
	SectionId,
	SectionProgress,
	SectionProgressId,
} from '@/domain/section-progress';
import { ILearningPathProgressReadRepository } from '@/app/learning-path-progress';
import { LearningPathNotStartedException } from '../exceptions';
import { UserId, UUID } from '@/domain/common';
import { randomUUID } from 'node:crypto';
import { LearningPathId } from '@/domain/learning-path-progress';

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
		private readonly learningPathProgressReadRepository: ILearningPathProgressReadRepository,
		private readonly learningPathsService: ILearningPathsService,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartSectionCommand): Promise<SectionProgressDto> {
		const section = await this.learningPathsService.findSectionById(
			command.sectionId,
		);

		if (!section) {
			throw new SectionNotFoundException(command.sectionId);
		}

		const learningPathProgressDto =
			await this.learningPathProgressReadRepository.findForUser(
				section.learningPathId,
				command.userId,
			);

		if (!learningPathProgressDto) {
			throw new LearningPathNotStartedException(
				section.learningPathId,
				command.userId,
			);
		}

		const id = SectionProgressId.create(UUID.create(randomUUID()));
		const sectionProgress = SectionProgress.create(id, {
			learningPathId: LearningPathId.create(
				UUID.create(section.learningPathId),
			),
			sectionId: SectionId.create(UUID.create(command.sectionId)),
			totalUnitCount: section.unitCount,
			userId: UserId.create(UUID.create(command.userId)),
		});

		await this.sectionProgressRepository.save(sectionProgress);

		const events = sectionProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			id: sectionProgress.id.toString(),
			completedUnitCount: sectionProgress.completedUnitCount,
			totalUnitCount: sectionProgress.totalUnitCount,
			learningPathId: sectionProgress.learningPathId.toString(),
			sectionId: sectionProgress.sectionId.toString(),
			userId: sectionProgress.userId.toString(),
		};
	}
}
