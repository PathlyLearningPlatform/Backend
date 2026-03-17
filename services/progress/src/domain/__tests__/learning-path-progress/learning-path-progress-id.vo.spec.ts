import { LearningPathProgressId } from '../../learning-path-progress/value-objects';
import { UUID } from '../../common';
import { TEST_UUIDS } from '../common/domain-test.utils';

describe('LearningPathProgressId', () => {
	it('creates from UUID and exposes value', () => {
		const uuid = UUID.create(TEST_UUIDS.learningPathProgressId);
		const progressId = LearningPathProgressId.create(uuid);

		expect(progressId.value).toBe(uuid);
		expect(progressId.toString()).toBe(TEST_UUIDS.learningPathProgressId);
	});

	it('compares equal for same UUID value', () => {
		const a = LearningPathProgressId.create(
			UUID.create(TEST_UUIDS.learningPathProgressId),
		);
		const b = LearningPathProgressId.create(
			UUID.create(TEST_UUIDS.learningPathProgressId),
		);

		expect(a.equals(b)).toBe(true);
	});
});