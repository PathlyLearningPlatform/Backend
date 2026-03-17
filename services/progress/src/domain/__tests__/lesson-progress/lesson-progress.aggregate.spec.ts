import { LessonProgress } from '../../lesson-progress/lesson-progress.aggregate';
import { LessonCompletedEvent } from '../../lesson-progress/events';
import { LessonId, LessonProgressId } from '../../lesson-progress/value-objects';
import { UnitId } from '../../unit-progress';
import { UserId, UUID } from '../../common';
import { TEST_NOW, TEST_UUIDS } from '../common/domain-test.utils';

describe('LessonProgress', () => {
	it('creates with zero completed activities', () => {
		const aggregate = LessonProgress.create(
			LessonProgressId.create(UUID.create(TEST_UUIDS.lessonProgressId)),
			{
				lessonId: LessonId.create(UUID.create(TEST_UUIDS.lessonId)),
				unitId: UnitId.create(UUID.create(TEST_UUIDS.unitId)),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
				totalActivityCount: 3,
			},
		);

		expect(aggregate.completedActivityCount).toBe(0);
		expect(aggregate.totalActivityCount).toBe(3);
		expect(aggregate.completedAt).toBeNull();
	});

	it('hydrates from data source', () => {
		const completedAt = new Date('2026-01-01T00:00:00.000Z');

		const aggregate = LessonProgress.fromDataSource({
			id: TEST_UUIDS.lessonProgressId,
			lessonId: TEST_UUIDS.lessonId,
			unitId: TEST_UUIDS.unitId,
			userId: TEST_UUIDS.userId,
			completedAt,
			completedActivityCount: 4,
			totalActivityCount: 4,
		});

		expect(aggregate.completedActivityCount).toBe(4);
		expect(aggregate.totalActivityCount).toBe(4);
		expect(aggregate.completedAt).toBe(completedAt);
	});

	it('increments progress and emits event only on last activity', () => {
		const aggregate = LessonProgress.create(
			LessonProgressId.create(UUID.create(TEST_UUIDS.lessonProgressId)),
			{
				lessonId: LessonId.create(UUID.create(TEST_UUIDS.lessonId)),
				unitId: UnitId.create(UUID.create(TEST_UUIDS.unitId)),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
				totalActivityCount: 2,
			},
		);

		aggregate.completeActivity(TEST_NOW);
		expect(aggregate.completedActivityCount).toBe(1);
		expect(aggregate.completedAt).toBeNull();
		expect(aggregate.events).toHaveLength(0);

		aggregate.completeActivity(TEST_NOW);
		expect(aggregate.completedActivityCount).toBe(2);
		expect(aggregate.completedAt).toBe(TEST_NOW);

		const events = aggregate.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(LessonCompletedEvent);
		expect(events[0]).toMatchObject({
			lessonId: TEST_UUIDS.lessonId,
			unitId: TEST_UUIDS.unitId,
			userId: TEST_UUIDS.userId,
			occuredAt: TEST_NOW,
		});
	});

	it('does not increment when already completed', () => {
		const completedAt = new Date('2026-01-10T00:00:00.000Z');
		const aggregate = LessonProgress.fromDataSource({
			id: TEST_UUIDS.lessonProgressId,
			lessonId: TEST_UUIDS.lessonId,
			unitId: TEST_UUIDS.unitId,
			userId: TEST_UUIDS.userId,
			completedAt,
			completedActivityCount: 2,
			totalActivityCount: 2,
		});

		aggregate.completeActivity(TEST_NOW);

		expect(aggregate.completedActivityCount).toBe(2);
		expect(aggregate.completedAt).toBe(completedAt);
		expect(aggregate.pullEvents()).toHaveLength(0);
	});
});