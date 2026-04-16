import {
	type ICommandHandler,
	type IEventBus,
	SectionNotFoundException,
} from '@/app/common';
import { Order, UserId, UUID } from '@/domain/common';
import {
	type ISectionProgressRepository,
	type ISectionRepository,
	PreviousSectionNotCompletedException,
	SectionId,
	SectionProgress,
	SectionProgressId,
} from '@/domain/sections';
import type { SectionProgressDto } from '../dtos';
import { progressAggregateToDto } from '../helpers';
import {
	type ILearningPathProgressRepository,
	LearningPathProgressId,
} from '@/domain/learning-paths';
import { LearningPathProgressNotFoundException } from '@/app/learning-paths/exceptions';

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
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartSectionCommand): Promise<StartSectionResult> {
		const sectionId = SectionId.create(command.sectionId);
		const section = await this.sectionRepository.findById(sectionId);

		if (!section) {
			throw new SectionNotFoundException(command.sectionId);
		}

		const userId = UserId.create(UUID.create(command.userId));
		const learningPathProgressId = LearningPathProgressId.create(
			section.learningPathId,
			userId,
		);

		const learningPathProgress =
			await this.learningPathProgressRepository.findById(
				learningPathProgressId,
			);

		if (!learningPathProgress) {
			throw new LearningPathProgressNotFoundException('');
		}

		if (!section.order.equals(Order.create(0))) {
			const previousSection =
				await this.sectionRepository.findByLearningPathIdAndOrder(
					section.learningPathId,
					Order.create(section.order.value - 1),
				);

			if (!previousSection) {
				throw new PreviousSectionNotCompletedException();
			}

			const previousSectionProgress =
				await this.sectionProgressRepository.findById(
					SectionProgressId.create(previousSection.id, userId),
				);

			if (!previousSectionProgress?.completedAt) {
				throw new PreviousSectionNotCompletedException();
			}
		}

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
