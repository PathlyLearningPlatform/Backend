import { SectionId } from '../../section-progress/value-objects';
import { UUID } from '../../common';
import { TEST_UUIDS } from '../common/domain-test.utils';

describe('SectionId', () => {
	it('creates from UUID and exposes value', () => {
		const uuid = UUID.create(TEST_UUIDS.sectionId);
		const sectionId = SectionId.create(uuid);

		expect(sectionId.value).toBe(uuid);
		expect(sectionId.toString()).toBe(TEST_UUIDS.sectionId);
	});

	it('compares equal for same UUID value', () => {
		const a = SectionId.create(UUID.create(TEST_UUIDS.sectionId));
		const b = SectionId.create(UUID.create(TEST_UUIDS.sectionId));

		expect(a.equals(b)).toBe(true);
	});
});