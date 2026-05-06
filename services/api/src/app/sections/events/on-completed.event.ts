import type { IEventBus, IEventHandler } from '@/app/common';
import { Order, UserId, UUID } from '@/domain/common';
import {
	type ILearningPathProgressRepository,
	LearningPathId,
	LearningPathProgressId,
} from '@/domain/learning-paths';
import {
	SectionId,
	SectionProgress,
	SectionProgressId,
	type ISectionProgressRepository,
	type ISectionRepository,
	type SectionCompletedEvent,
} from '@/domain/sections';

export class OnSectionCompletedHandler
	implements IEventHandler<SectionCompletedEvent>
{
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
		private readonly sectionProgressRepository: ISectionProgressRepository,
		private readonly sectionRepository: ISectionRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: SectionCompletedEvent): Promise<void> {
		const learningPathId = LearningPathId.create(
			UUID.create(event.payload.learningPathId),
		);
		const userId = UserId.create(UUID.create(event.userId));
		const learningPathProgressId = LearningPathProgressId.create(
			learningPathId,
			userId,
		);

		const learningPathProgressDto =
			await this.learningPathProgressRepository.findById(
				learningPathProgressId,
			);

		if (!learningPathProgressDto) {
			return;
		}

		const learningPathProgress =
			await this.learningPathProgressRepository.findById(
				LearningPathProgressId.create(
					LearningPathId.create(UUID.create(event.payload.learningPathId)),
					UserId.create(UUID.create(event.userId)),
				),
			);

		if (!learningPathProgress) {
			return;
		}

		learningPathProgress.completeSection(event.occuredAt);

		await this.learningPathProgressRepository.save(learningPathProgress);
		await this.eventBus.publish(learningPathProgress.pullEvents());

		const sectionId = SectionId.create(event.payload.sectionId);
		const section = await this.sectionRepository.findById(sectionId);

		if (!section) {
			return;
		}

		const nextSection =
			await this.sectionRepository.findByLearningPathIdAndOrder(
				learningPathId,
				Order.create(section.order.value + 1),
			);

		if (!nextSection) {
			console.log(
				`Section ${section.id.value} is the last in learning path ${learningPathId.value}`,
			);
			return;
		}

		const nextSectionProgressId = SectionProgressId.create(
			nextSection.id,
			userId,
		);
		const nextSectionProgress = SectionProgress.create(nextSectionProgressId, {
			createdAt: event.occuredAt,
			totalUnitCount: nextSection.unitCount,
			learningPathId: learningPathId,
		});

		await this.sectionProgressRepository.save(nextSectionProgress);
		await this.eventBus.publish(nextSectionProgress.pullEvents());
	}
}
