import type { IEventBus, IEventHandler } from '@/app/common';
import type { ILearningPathProgressReadRepository } from '@/app/learning-paths/interfaces';
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
		private readonly learningPathProgressReadRepository: ILearningPathProgressReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: SectionCompletedEvent): Promise<void> {
		const learningPathProgressDto =
			await this.learningPathProgressReadRepository.findOneForUser(
				event.learningPathId,
				event.userId,
			);

		if (!learningPathProgressDto) {
			return;
		}

		const learningPathProgress = await this.learningPathProgressRepository.load(
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
