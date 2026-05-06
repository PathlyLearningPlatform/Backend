import type { IEventBus, IEventHandler } from '@/app/common';
import { Order, UserId, UUID } from '@/domain/common';
import {
	LearningPathId,
	type LearningPathStartedEvent,
} from '@/domain/learning-paths';
import {
	ISectionProgressRepository,
	ISectionRepository,
	SectionProgress,
	SectionProgressId,
} from '@/domain/sections';

export class OnLearningPathStartedHandler
	implements IEventHandler<LearningPathStartedEvent>
{
	constructor(
		private readonly sectionProgressRepository: ISectionProgressRepository,
		private readonly sectionRepository: ISectionRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: LearningPathStartedEvent): Promise<void> {
		const learningPathId = LearningPathId.create(event.payload.learningPathId);

		const firstSection =
			await this.sectionRepository.findByLearningPathIdAndOrder(
				learningPathId,
				Order.create(0),
			);

		if (!firstSection) {
			console.warn(
				`Learning path ${event.payload.learningPathId} does not have any sections, ignoring started event`,
			);
			return;
		}

		const userId = UserId.create(UUID.create(event.userId));
		const sectionProgressId = SectionProgressId.create(firstSection.id, userId);

		const sectionProgress = SectionProgress.create(sectionProgressId, {
			createdAt: event.occuredAt,
			learningPathId: learningPathId,
			totalUnitCount: firstSection.unitCount,
		});

		const events = sectionProgress.pullEvents();
		await this.sectionProgressRepository.save(sectionProgress);
		await this.eventBus.publish(events);
	}
}
