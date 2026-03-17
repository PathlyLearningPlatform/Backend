import { ActivityId } from '../../activity-progress/value-objects';
import { UUID } from '../../common';
import { TEST_UUIDS } from '../common/domain-test.utils';

describe('ActivityId', () => {
	it('creates from UUID and exposes value', () => {
		const uuid = UUID.create(TEST_UUIDS.activityId);
		const activityId = ActivityId.create(uuid);

		expect(activityId.value).toBe(uuid);
		expect(activityId.toString()).toBe(TEST_UUIDS.activityId);
	});

	it('compares equal for same UUID value', () => {
		const a = ActivityId.create(UUID.create(TEST_UUIDS.activityId));
		const b = ActivityId.create(UUID.create(TEST_UUIDS.activityId));

		expect(a.equals(b)).toBe(true);
	});
});