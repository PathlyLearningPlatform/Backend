import { RemoveSectionHandler } from '../../../sections/commands/remove.command';
import { SectionNotFoundException } from '../../../common/exceptions/section-not-found.exception';
import { SectionId } from '@/domain/sections/value-objects/id.vo';
import { mockLearningPathRepo, mockSectionRepo, makeLearningPath, makeSection, TEST_IDS } from '../../common';

describe('RemoveSectionHandler', () => {
	it('removes a section and updates the learning path', async () => {
		const section = makeSection();
		const lp = makeLearningPath();
		lp.addSection(SectionId.create(TEST_IDS.SECTION_ID));

		const sectionRepo = mockSectionRepo({ load: jest.fn().mockResolvedValue(section) });
		const lpRepo = mockLearningPathRepo({ load: jest.fn().mockResolvedValue(lp) });
		const handler = new RemoveSectionHandler(lpRepo, sectionRepo);

		await handler.execute({ sectionId: TEST_IDS.SECTION_ID });

		expect(sectionRepo.remove).toHaveBeenCalledTimes(1);
		expect(lpRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws SectionNotFoundException when section not found', async () => {
		const sectionRepo = mockSectionRepo();
		const lpRepo = mockLearningPathRepo();
		const handler = new RemoveSectionHandler(lpRepo, sectionRepo);

		await expect(
			handler.execute({ sectionId: TEST_IDS.SECTION_ID }),
		).rejects.toThrow(SectionNotFoundException);
	});
});
