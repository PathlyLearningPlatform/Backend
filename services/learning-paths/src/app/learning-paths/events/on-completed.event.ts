import type { IEventHandler } from '@/app/common';
import type { LearningPathCompletedEvent } from '@/domain/learning-paths';

export class OnLearningPathCompletedHandler
	implements IEventHandler<LearningPathCompletedEvent>
{
	async handle(_event: LearningPathCompletedEvent): Promise<void> {}
}
