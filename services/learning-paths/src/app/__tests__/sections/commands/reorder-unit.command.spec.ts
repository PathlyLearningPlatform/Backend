import { ReorderUnitHandler } from '../../../sections/commands/reorder-unit.command';
import { UnitNotFoundException } from '../../../common/exceptions/unit-not-found.exception';
import { UnitId } from '@/domain/units/value-objects/id.vo';
import { mockSectionRepo, mockUnitRepo, makeSection, makeUnit, TEST_IDS } from '../../common';

describe('ReorderUnitHandler', () => {
	it('reorders a unit within a section', async () => {
		const section = makeSection();
		section.addUnit(UnitId.create(TEST_IDS.UNIT_ID));
		section.addUnit(UnitId.create(TEST_IDS.UNIT_ID2));

		const unit = makeUnit();
		const sectionRepo = mockSectionRepo({ load: jest.fn().mockResolvedValue(section) });
		const unitRepo = mockUnitRepo({ load: jest.fn().mockResolvedValue(unit) });
		const handler = new ReorderUnitHandler(sectionRepo, unitRepo);

		await handler.execute({ unitId: TEST_IDS.UNIT_ID, order: 1 });

		expect(unitRepo.save).toHaveBeenCalledTimes(1);
		expect(sectionRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws UnitNotFoundException when unit not found', async () => {
		const sectionRepo = mockSectionRepo();
		const unitRepo = mockUnitRepo();
		const handler = new ReorderUnitHandler(sectionRepo, unitRepo);

		await expect(
			handler.execute({ unitId: TEST_IDS.UNIT_ID, order: 0 }),
		).rejects.toThrow(UnitNotFoundException);
	});
});
