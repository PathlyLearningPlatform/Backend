import { LessonId } from '../../lesson-progress/value-objects';
import { UUID } from '../../common';
import { TEST_UUIDS } from '../common/domain-test.utils';

describe('LessonId', () => {
	it('creates from UUID and exposes value', () => {
		const uuid = UUID.create(TEST_UUIDS.lessonId);
		const lessonId = LessonId.create(uuid);

		expect(lessonId.value).toBe(uuid);
		expect(lessonId.toString()).toBe(TEST_UUIDS.lessonId);
	});

	it('compares equal for same UUID value', () => {
		const a = LessonId.create(UUID.create(TEST_UUIDS.lessonId));
		const b = LessonId.create(UUID.create(TEST_UUIDS.lessonId));

		expect(a.equals(b)).toBe(true);
	});
});