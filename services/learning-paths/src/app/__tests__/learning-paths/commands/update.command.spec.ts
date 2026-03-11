import { UpdateLearningPathHandler } from '../../../learning-paths/commands/update.command';
import { LearningPathNotFoundException } from '../../../common/exceptions/learning-path-not-found.exception';
import { mockLearningPathRepo, makeLearningPath, TEST_IDS } from '../../common';

describe('UpdateLearningPathHandler', () => {
	it('updates a learning path and saves it', async () => {
		const lp = makeLearningPath();
		const repo = mockLearningPathRepo({ load: jest.fn().mockResolvedValue(lp) });
		const handler = new UpdateLearningPathHandler(repo);

		const result = await handler.execute({
			where: { id: TEST_IDS.LP_ID },
			props: { name: 'Updated', description: 'New desc' },
		});

		expect(result.name).toBe('Updated');
		expect(result.description).toBe('New desc');
		expect(result.updatedAt).toBeInstanceOf(Date);
		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it('throws LearningPathNotFoundException when not found', async () => {
		const repo = mockLearningPathRepo();
		const handler = new UpdateLearningPathHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.LP_ID } }),
		).rejects.toThrow(LearningPathNotFoundException);
	});
});
