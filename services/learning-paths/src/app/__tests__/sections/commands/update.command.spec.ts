import { UpdateSectionHandler } from '../../../sections/commands/update.command';
import { SectionNotFoundException } from '../../../common/exceptions/section-not-found.exception';
import { mockSectionRepo, makeSection, TEST_IDS } from '../../common';

describe('UpdateSectionHandler', () => {
	it('updates a section and saves it', async () => {
		const section = makeSection();
		const repo = mockSectionRepo({ load: jest.fn().mockResolvedValue(section) });
		const handler = new UpdateSectionHandler(repo);

		const result = await handler.execute({
			where: { id: TEST_IDS.SECTION_ID },
			props: { name: 'Updated', description: 'New desc' },
		});

		expect(result.name).toBe('Updated');
		expect(result.description).toBe('New desc');
		expect(result.updatedAt).toBeInstanceOf(Date);
		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it('throws SectionNotFoundException when not found', async () => {
		const repo = mockSectionRepo();
		const handler = new UpdateSectionHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.SECTION_ID } }),
		).rejects.toThrow(SectionNotFoundException);
	});
});
