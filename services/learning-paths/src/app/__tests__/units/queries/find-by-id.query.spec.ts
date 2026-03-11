import { FindUnitByIdHandler } from '../../../units/queries/find-by-id.query';
import { UnitNotFoundException } from '../../../common/exceptions/unit-not-found.exception';
import { UnitDto } from '../../../units/dtos';
import { mockUnitReadRepo, TEST_IDS, DEFAULT_DATE } from '../../common';

const sampleDto: UnitDto = {
	id: TEST_IDS.UNIT_ID,
	sectionId: TEST_IDS.SECTION_ID,
	name: 'Test Unit',
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	order: 0,
	lessonCount: 0,
};

describe('FindUnitByIdHandler', () => {
	it('returns the unit when found', async () => {
		const repo = mockUnitReadRepo({
			findById: jest.fn().mockResolvedValue(sampleDto),
		});
		const handler = new FindUnitByIdHandler(repo);

		const result = await handler.execute({ where: { id: TEST_IDS.UNIT_ID } });

		expect(result).toEqual(sampleDto);
		expect(repo.findById).toHaveBeenCalledWith(TEST_IDS.UNIT_ID);
	});

	it('throws UnitNotFoundException when not found', async () => {
		const repo = mockUnitReadRepo();
		const handler = new FindUnitByIdHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.UNIT_ID } }),
		).rejects.toThrow(UnitNotFoundException);
	});
});
