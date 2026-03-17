import { ActivityProgressId } from '../../activity-progress/value-objects';
import { UUID } from '../../common';
import { TEST_UUIDS } from '../common/domain-test.utils';

describe('ActivityProgressId', () => {
	it('creates from UUID and exposes value', () => {
		const uuid = UUID.create(TEST_UUIDS.activityProgressId);
		const progressId = ActivityProgressId.create(uuid);

		expect(progressId.value).toBe(uuid);
		expect(progressId.toString()).toBe(TEST_UUIDS.activityProgressId);
	});

	it('compares equal for same UUID value', () => {
		const a = ActivityProgressId.create(
			UUID.create(TEST_UUIDS.activityProgressId),
		);
		const b = ActivityProgressId.create(
			UUID.create(TEST_UUIDS.activityProgressId),
		);

		expect(a.equals(b)).toBe(true);
	});
});