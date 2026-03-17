import { OnLearningPathCompletedHandler } from '@/app/learning-path-progress/events';
import { LearningPathCompletedEvent } from '@/domain/learning-path-progress';
import { APP_TEST_IDS } from '../../common/test.utils';

describe('OnLearningPathCompletedHandler', () => {
	it('handles event as no-op without throwing', async () => {
		const handler = new OnLearningPathCompletedHandler();
		const event = new LearningPathCompletedEvent(
			APP_TEST_IDS.learningPathId,
			APP_TEST_IDS.userId,
			new Date('2026-01-01T00:00:00.000Z'),
		);

		await expect(handler.handle(event)).resolves.toBeUndefined();
	});
});