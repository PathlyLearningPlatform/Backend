import { AddUnitHandler } from '../../../sections/commands/add-unit.command';
import { SectionNotFoundException } from '../../../common/exceptions/section-not-found.exception';
import { mockSectionRepo, mockUnitRepo, makeSection, TEST_IDS } from '../../common';

describe('AddUnitHandler', () => {
	it('adds a unit to a section', async () => {
		const section = makeSection();
		const sectionRepo = mockSectionRepo({ load: jest.fn().mockResolvedValue(section) });
		const unitRepo = mockUnitRepo();
		const handler = new AddUnitHandler(sectionRepo, unitRepo);

		const result = await handler.execute({
			sectionId: TEST_IDS.SECTION_ID,
			name: 'New Unit',
			description: 'Unit desc',
		});

		expect(result.name).toBe('New Unit');
		expect(result.description).toBe('Unit desc');
		expect(result.sectionId).toBe(TEST_IDS.SECTION_ID);
		expect(result.order).toBe(0);
		expect(result.lessonCount).toBe(0);
		expect(unitRepo.save).toHaveBeenCalledTimes(1);
		expect(sectionRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws SectionNotFoundException when section not found', async () => {
		const sectionRepo = mockSectionRepo();
		const unitRepo = mockUnitRepo();
		const handler = new AddUnitHandler(sectionRepo, unitRepo);

		await expect(
			handler.execute({ sectionId: TEST_IDS.SECTION_ID, name: 'Unit' }),
		).rejects.toThrow(SectionNotFoundException);
	});
});
