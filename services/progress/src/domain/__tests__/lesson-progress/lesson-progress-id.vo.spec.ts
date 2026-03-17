import { LessonProgressId } from '../../lesson-progress/value-objects';
import { UUID } from '../../common';
import { TEST_UUIDS } from '../common/domain-test.utils';

describe('LessonProgressId', () => {
	it('creates from UUID and exposes value', () => {
		const uuid = UUID.create(TEST_UUIDS.lessonProgressId);
		const progressId = LessonProgressId.create(uuid);

		expect(progressId.value).toBe(uuid);
		expect(progressId.toString()).toBe(TEST_UUIDS.lessonProgressId);
	});

	it('compares equal for same UUID value', () => {
		const a = LessonProgressId.create(UUID.create(TEST_UUIDS.lessonProgressId));
		const b = LessonProgressId.create(UUID.create(TEST_UUIDS.lessonProgressId));

		expect(a.equals(b)).toBe(true);
	});
});