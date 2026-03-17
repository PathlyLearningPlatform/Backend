import { UserId, UUID } from '../../common';
import { SectionId } from '../../section-progress';
import { UnitProgress } from '../../unit-progress/unit-progress.aggregate';
import { UnitCompletedEvent } from '../../unit-progress/events';
import { UnitId, UnitProgressId } from '../../unit-progress/value-objects';
import { TEST_NOW, TEST_UUIDS } from '../common/domain-test.utils';

describe('UnitProgress', () => {
	it('creates with zero completed lessons', () => {
		const aggregate = UnitProgress.create(
			UnitProgressId.create(UUID.create(TEST_UUIDS.unitProgressId)),
			{
				unitId: UnitId.create(UUID.create(TEST_UUIDS.unitId)),
				sectionId: SectionId.create(UUID.create(TEST_UUIDS.sectionId)),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
				totalLessonCount: 3,
			},
		);

		expect(aggregate.completedLessonCount).toBe(0);
		expect(aggregate.totalLessonCount).toBe(3);
		expect(aggregate.completedAt).toBeNull();
	});

	it('hydrates from data source', () => {
		const completedAt = new Date('2026-01-01T00:00:00.000Z');

		const aggregate = UnitProgress.fromDataSource({
			id: TEST_UUIDS.unitProgressId,
			unitId: TEST_UUIDS.unitId,
			sectionId: TEST_UUIDS.sectionId,
			userId: TEST_UUIDS.userId,
			completedAt,
			completedLessonCount: 4,
			totalLessonCount: 4,
		});

		expect(aggregate.completedLessonCount).toBe(4);
		expect(aggregate.totalLessonCount).toBe(4);
		expect(aggregate.completedAt).toBe(completedAt);
	});

	it('increments progress and emits event only on last lesson', () => {
		const aggregate = UnitProgress.create(
			UnitProgressId.create(UUID.create(TEST_UUIDS.unitProgressId)),
			{
				unitId: UnitId.create(UUID.create(TEST_UUIDS.unitId)),
				sectionId: SectionId.create(UUID.create(TEST_UUIDS.sectionId)),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
				totalLessonCount: 2,
			},
		);

		aggregate.completeLesson(TEST_NOW);
		expect(aggregate.completedLessonCount).toBe(1);
		expect(aggregate.completedAt).toBeNull();
		expect(aggregate.events).toHaveLength(0);

		aggregate.completeLesson(TEST_NOW);
		expect(aggregate.completedLessonCount).toBe(2);
		expect(aggregate.completedAt).toBe(TEST_NOW);

		const events = aggregate.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(UnitCompletedEvent);
		expect(events[0]).toMatchObject({
			unitId: TEST_UUIDS.unitId,
			sectionId: TEST_UUIDS.sectionId,
			userId: TEST_UUIDS.userId,
			occuredAt: TEST_NOW,
		});
	});

	it('does not increment when already completed', () => {
		const completedAt = new Date('2026-01-10T00:00:00.000Z');
		const aggregate = UnitProgress.fromDataSource({
			id: TEST_UUIDS.unitProgressId,
			unitId: TEST_UUIDS.unitId,
			sectionId: TEST_UUIDS.sectionId,
			userId: TEST_UUIDS.userId,
			completedAt,
			completedLessonCount: 2,
			totalLessonCount: 2,
		});

		aggregate.completeLesson(TEST_NOW);

		expect(aggregate.completedLessonCount).toBe(2);
		expect(aggregate.completedAt).toBe(completedAt);
		expect(aggregate.pullEvents()).toHaveLength(0);
	});
});