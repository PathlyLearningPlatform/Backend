import { IEventHandler } from '@/app/common';
import { LearningPathCompletedEvent } from '@/domain/learning-path-progress';

export class OnLearningPathCompletedHandler
	implements IEventHandler<LearningPathCompletedEvent>
{
	constructor() {}

	async handle(event: LearningPathCompletedEvent): Promise<void> {}
}
