import { RemoveUnitHandler } from '../../../units/commands/remove.command';
import { UnitNotFoundException } from '../../../common/exceptions/unit-not-found.exception';
import { UnitId } from '@/domain/units/value-objects/id.vo';
import { mockSectionRepo, mockUnitRepo, makeSection, makeUnit, TEST_IDS } from '../../common';

describe('RemoveUnitHandler', () => {
	it('removes a unit and updates the section', async () => {
		const unit = makeUnit();
		const section = makeSection();
		section.addUnit(UnitId.create(TEST_IDS.UNIT_ID));

		const unitRepo = mockUnitRepo({ load: jest.fn().mockResolvedValue(unit) });
		const sectionRepo = mockSectionRepo({ load: jest.fn().mockResolvedValue(section) });
		const handler = new RemoveUnitHandler(sectionRepo, unitRepo);

		await handler.execute({ unitId: TEST_IDS.UNIT_ID });

		expect(unitRepo.remove).toHaveBeenCalledTimes(1);
		expect(sectionRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws UnitNotFoundException when unit not found', async () => {
		const unitRepo = mockUnitRepo();
		const sectionRepo = mockSectionRepo();
		const handler = new RemoveUnitHandler(sectionRepo, unitRepo);

		await expect(
			handler.execute({ unitId: TEST_IDS.UNIT_ID }),
		).rejects.toThrow(UnitNotFoundException);
	});
});
