import type { IEventBus, IEventHandler } from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import {
	type ILearningPathProgressRepository,
	LearningPathId,
	LearningPathProgressId,
} from '@/domain/learning-paths';
import type { SectionCompletedEvent } from '@/domain/sections';

export class OnSectionCompletedHandler
	implements IEventHandler<SectionCompletedEvent>
{
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: SectionCompletedEvent): Promise<void> {
		const learningPathId = LearningPathId.create(
			UUID.create(event.learningPathId),
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
					LearningPathId.create(UUID.create(event.learningPathId)),
					UserId.create(UUID.create(event.userId)),
				),
			);

		if (!learningPathProgress) {
			return;
		}

		learningPathProgress.completeSection(event.occuredAt);

		await this.learningPathProgressRepository.save(learningPathProgress);

		const events = learningPathProgress.pullEvents();
		await this.eventBus.publish(events);
	}
}
