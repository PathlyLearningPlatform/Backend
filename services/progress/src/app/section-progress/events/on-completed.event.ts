import { IEventHandler } from '@/app/common';
import { IEventBus } from '@/app/common/ports';
import { ILearningPathProgressReadRepository } from '@/app/learning-path-progress';
import { UUID } from '@/domain/common';
import {
	ILearningPathProgressRepository,
	LearningPathProgressId,
} from '@/domain/learning-path-progress';
import { SectionCompletedEvent } from '@/domain/section-progress';

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
			await this.learningPathProgressReadRepository.findForUser(
				event.learningPathId,
				event.userId,
			);

		if (!learningPathProgressDto) {
			return;
		}

		const learningPathProgress = await this.learningPathProgressRepository.load(
			LearningPathProgressId.create(UUID.create(learningPathProgressDto.id)),
		);

		if (!learningPathProgress) {
			return;
		}

		learningPathProgress.completeSection(event.occuredAt);

		const events = learningPathProgress.pullEvents();
		await this.eventBus.publish(events);
	}
}
