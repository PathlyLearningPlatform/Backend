import { LearningPathNotFoundException } from '@/app/common';
import {
	RemoveLearningPathProgressHandler,
	StartLearningPathHandler,
} from '@/app/learning-path-progress/commands';
import { LearningPathProgressNotFoundException } from '@/app/learning-path-progress/exceptions';
import { APP_TEST_IDS, createEventBusMock } from '../../common/test.utils';

describe('learning-path-progress commands', () => {
	it('start creates progress and publishes events', async () => {
		const repository = { save: jest.fn() };
		const learningPathsService = {
			findLearningPathById: jest.fn().mockResolvedValue({
				id: APP_TEST_IDS.learningPathId,
				sectionCount: 8,
			}),
		};
		const eventBus = createEventBusMock();
		const handler = new StartLearningPathHandler(
			repository as never,
			learningPathsService as never,
			eventBus as never,
		);

		const result = await handler.execute({
			learningPathId: APP_TEST_IDS.learningPathId,
			userId: APP_TEST_IDS.userId,
		});

		expect(repository.save).toHaveBeenCalledTimes(1);
		expect(eventBus.publish).toHaveBeenCalledTimes(1);
		expect(result.learningPathId).toBe(APP_TEST_IDS.learningPathId);
		expect(result.userId).toBe(APP_TEST_IDS.userId);
		expect(result.totalSectionCount).toBe(8);
		expect(result.completedSectionCount).toBe(0);
	});

	it('start throws when learning path does not exist', async () => {
		const handler = new StartLearningPathHandler(
			{ save: jest.fn() } as never,
			{ findLearningPathById: jest.fn().mockResolvedValue(null) } as never,
			createEventBusMock() as never,
		);

		await expect(
			handler.execute({
				learningPathId: APP_TEST_IDS.learningPathId,
				userId: APP_TEST_IDS.userId,
			}),
		).rejects.toBeInstanceOf(LearningPathNotFoundException);
	});

	it('remove deletes learning-path progress', async () => {
		const repository = { remove: jest.fn().mockResolvedValue(true) };
		const handler = new RemoveLearningPathProgressHandler(repository as never);

		await handler.execute({ id: APP_TEST_IDS.learningPathProgressId });
		expect(repository.remove).toHaveBeenCalledTimes(1);
	});

	it('remove throws when learning-path progress does not exist', async () => {
		const repository = { remove: jest.fn().mockResolvedValue(false) };
		const handler = new RemoveLearningPathProgressHandler(repository as never);

		await expect(
			handler.execute({ id: APP_TEST_IDS.learningPathProgressId }),
		).rejects.toBeInstanceOf(LearningPathProgressNotFoundException);
	});
});