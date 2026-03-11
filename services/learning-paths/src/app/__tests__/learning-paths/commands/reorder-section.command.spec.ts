import { ReorderSectionHandler } from '../../../learning-paths/commands/reorder-section.command';
import { SectionNotFoundException } from '../../../common/exceptions/section-not-found.exception';
import { SectionId } from '@/domain/sections/value-objects/id.vo';
import { mockLearningPathRepo, mockSectionRepo, makeLearningPath, makeSection, TEST_IDS } from '../../common';

describe('ReorderSectionHandler', () => {
	it('reorders a section within a learning path', async () => {
		const lp = makeLearningPath();
		lp.addSection(SectionId.create(TEST_IDS.SECTION_ID));
		lp.addSection(SectionId.create(TEST_IDS.SECTION_ID2));

		const section = makeSection();
		const lpRepo = mockLearningPathRepo({ load: jest.fn().mockResolvedValue(lp) });
		const sectionRepo = mockSectionRepo({ load: jest.fn().mockResolvedValue(section) });
		const handler = new ReorderSectionHandler(lpRepo, sectionRepo);

		await handler.execute({ sectionId: TEST_IDS.SECTION_ID, order: 1 });

		expect(sectionRepo.save).toHaveBeenCalledTimes(1);
		expect(lpRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws SectionNotFoundException when section not found', async () => {
		const lpRepo = mockLearningPathRepo();
		const sectionRepo = mockSectionRepo();
		const handler = new ReorderSectionHandler(lpRepo, sectionRepo);

		await expect(
			handler.execute({ sectionId: TEST_IDS.SECTION_ID, order: 0 }),
		).rejects.toThrow(SectionNotFoundException);
	});
});
