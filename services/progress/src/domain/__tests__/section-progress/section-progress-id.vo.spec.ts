import { SectionProgressId } from '../../section-progress/value-objects';
import { UUID } from '../../common';
import { TEST_UUIDS } from '../common/domain-test.utils';

describe('SectionProgressId', () => {
	it('creates from UUID and exposes value', () => {
		const uuid = UUID.create(TEST_UUIDS.sectionProgressId);
		const progressId = SectionProgressId.create(uuid);

		expect(progressId.value).toBe(uuid);
		expect(progressId.toString()).toBe(TEST_UUIDS.sectionProgressId);
	});

	it('compares equal for same UUID value', () => {
		const a = SectionProgressId.create(UUID.create(TEST_UUIDS.sectionProgressId));
		const b = SectionProgressId.create(UUID.create(TEST_UUIDS.sectionProgressId));

		expect(a.equals(b)).toBe(true);
	});
});