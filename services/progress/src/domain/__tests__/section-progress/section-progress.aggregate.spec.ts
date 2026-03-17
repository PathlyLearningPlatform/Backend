import { UserId, UUID } from '../../common';
import { LearningPathId } from '../../learning-path-progress';
import { SectionProgress } from '../../section-progress/section-progress.aggregate';
import { SectionCompletedEvent } from '../../section-progress/events';
import { SectionId, SectionProgressId } from '../../section-progress/value-objects';
import { TEST_NOW, TEST_UUIDS } from '../common/domain-test.utils';

describe('SectionProgress', () => {
	it('creates with zero completed units', () => {
		const aggregate = SectionProgress.create(
			SectionProgressId.create(UUID.create(TEST_UUIDS.sectionProgressId)),
			{
				sectionId: SectionId.create(UUID.create(TEST_UUIDS.sectionId)),
				learningPathId: LearningPathId.create(
					UUID.create(TEST_UUIDS.learningPathId),
				),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
				totalUnitCount: 3,
			},
		);

		expect(aggregate.completedUnitCount).toBe(0);
		expect(aggregate.totalUnitCount).toBe(3);
		expect(aggregate.completedAt).toBeNull();
	});

	it('hydrates from data source', () => {
		const completedAt = new Date('2026-01-01T00:00:00.000Z');

		const aggregate = SectionProgress.fromDataSource({
			id: TEST_UUIDS.sectionProgressId,
			sectionId: TEST_UUIDS.sectionId,
			learningPathId: TEST_UUIDS.learningPathId,
			userId: TEST_UUIDS.userId,
			completedAt,
			completedUnitCount: 4,
			totalUnitCount: 4,
		});

		expect(aggregate.completedUnitCount).toBe(4);
		expect(aggregate.totalUnitCount).toBe(4);
		expect(aggregate.completedAt).toBe(completedAt);
	});

	it('increments progress and emits event only on last unit', () => {
		const aggregate = SectionProgress.create(
			SectionProgressId.create(UUID.create(TEST_UUIDS.sectionProgressId)),
			{
				sectionId: SectionId.create(UUID.create(TEST_UUIDS.sectionId)),
				learningPathId: LearningPathId.create(
					UUID.create(TEST_UUIDS.learningPathId),
				),
				userId: UserId.create(UUID.create(TEST_UUIDS.userId)),
				totalUnitCount: 2,
			},
		);

		aggregate.completeUnit(TEST_NOW);
		expect(aggregate.completedUnitCount).toBe(1);
		expect(aggregate.completedAt).toBeNull();
		expect(aggregate.events).toHaveLength(0);

		aggregate.completeUnit(TEST_NOW);
		expect(aggregate.completedUnitCount).toBe(2);
		expect(aggregate.completedAt).toBe(TEST_NOW);

		const events = aggregate.pullEvents();
		expect(events).toHaveLength(1);
		expect(events[0]).toBeInstanceOf(SectionCompletedEvent);
		expect(events[0]).toMatchObject({
			sectionId: TEST_UUIDS.sectionId,
			learningPathId: TEST_UUIDS.learningPathId,
			userId: TEST_UUIDS.userId,
			occuredAt: TEST_NOW,
		});
	});

	it('does not increment when already completed', () => {
		const completedAt = new Date('2026-01-10T00:00:00.000Z');
		const aggregate = SectionProgress.fromDataSource({
			id: TEST_UUIDS.sectionProgressId,
			sectionId: TEST_UUIDS.sectionId,
			learningPathId: TEST_UUIDS.learningPathId,
			userId: TEST_UUIDS.userId,
			completedAt,
			completedUnitCount: 2,
			totalUnitCount: 2,
		});

		aggregate.completeUnit(TEST_NOW);

		expect(aggregate.completedUnitCount).toBe(2);
		expect(aggregate.completedAt).toBe(completedAt);
		expect(aggregate.pullEvents()).toHaveLength(0);
	});
});