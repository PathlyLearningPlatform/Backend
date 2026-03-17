import { UnitId } from '../../unit-progress/value-objects';
import { UUID } from '../../common';
import { TEST_UUIDS } from '../common/domain-test.utils';

describe('UnitId', () => {
	it('creates from UUID and exposes value', () => {
		const uuid = UUID.create(TEST_UUIDS.unitId);
		const unitId = UnitId.create(uuid);

		expect(unitId.value).toBe(uuid);
		expect(unitId.toString()).toBe(TEST_UUIDS.unitId);
	});

	it('compares equal for same UUID value', () => {
		const a = UnitId.create(UUID.create(TEST_UUIDS.unitId));
		const b = UnitId.create(UUID.create(TEST_UUIDS.unitId));

		expect(a.equals(b)).toBe(true);
	});
});