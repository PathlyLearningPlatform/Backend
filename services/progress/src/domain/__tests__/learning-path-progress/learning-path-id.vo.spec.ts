import { LearningPathId } from '../../learning-path-progress/value-objects';
import { UUID } from '../../common';
import { TEST_UUIDS } from '../common/domain-test.utils';

describe('LearningPathId', () => {
	it('creates from UUID and exposes value', () => {
		const uuid = UUID.create(TEST_UUIDS.learningPathId);
		const learningPathId = LearningPathId.create(uuid);

		expect(learningPathId.value).toBe(uuid);
		expect(learningPathId.toString()).toBe(TEST_UUIDS.learningPathId);
	});

	it('compares equal for same UUID value', () => {
		const a = LearningPathId.create(UUID.create(TEST_UUIDS.learningPathId));
		const b = LearningPathId.create(UUID.create(TEST_UUIDS.learningPathId));

		expect(a.equals(b)).toBe(true);
	});
});