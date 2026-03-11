import { AddSectionHandler } from '../../../learning-paths/commands/add-section.command';
import { LearningPathNotFoundException } from '../../../common/exceptions/learning-path-not-found.exception';
import { mockLearningPathRepo, mockSectionRepo, makeLearningPath, TEST_IDS } from '../../common';

describe('AddSectionHandler', () => {
	it('adds a section to a learning path', async () => {
		const lp = makeLearningPath();
		const lpRepo = mockLearningPathRepo({ load: jest.fn().mockResolvedValue(lp) });
		const sectionRepo = mockSectionRepo();
		const handler = new AddSectionHandler(lpRepo, sectionRepo);

		const result = await handler.execute({
			learningPathId: TEST_IDS.LP_ID,
			name: 'New Section',
			description: 'Section desc',
		});

		expect(result.name).toBe('New Section');
		expect(result.description).toBe('Section desc');
		expect(result.learningPathId).toBe(TEST_IDS.LP_ID);
		expect(result.order).toBe(0);
		expect(result.unitCount).toBe(0);
		expect(sectionRepo.save).toHaveBeenCalledTimes(1);
		expect(lpRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws LearningPathNotFoundException when learning path not found', async () => {
		const lpRepo = mockLearningPathRepo();
		const sectionRepo = mockSectionRepo();
		const handler = new AddSectionHandler(lpRepo, sectionRepo);

		await expect(
			handler.execute({ learningPathId: TEST_IDS.LP_ID, name: 'Section' }),
		).rejects.toThrow(LearningPathNotFoundException);
	});
});
